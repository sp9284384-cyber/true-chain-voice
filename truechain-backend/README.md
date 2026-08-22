# TrueChain backend

Working FastAPI + SQLite backend for the anonymous reporting platform, matching
the architecture in `Overview.docx` exactly. Every endpoint below has been
tested end-to-end, including the tamper-detection demo flow.

## What's implemented and verified working

- Anonymous report submission (no PII fields, ever) — `POST /reports`
- Session-token status check — `GET /reports/{token}/status`
- Evidence upload with EXIF/metadata stripping — `POST /reports/{id}/evidence`
- Encryption at rest (Fernet) for both report content and evidence files
- SHA-256 hash-chained integrity log (`report_hash` / `prev_hash`)
- Public chain verification (no login needed) — `GET /verify` and `GET /verify/{id}`
- **Tamper detection confirmed working**: manually editing a stored report causes
  `/verify` to correctly flag the exact broken record
- Investigator auth (JWT + bcrypt) — `POST /investigator/login`
- Investigator dashboard queue sorted by AI urgency — `GET /investigator/reports`
- Append-only status updates (never mutates original report) — `PATCH /investigator/reports/{id}/status`
- AI triage via Ollama with safe fallback if Ollama is unreachable — never blocks submission
- CORS pre-configured for `localhost:3000` so the frontend connects with zero backend changes

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

`sentence-transformers` (used only for the optional embedding/clustering
stretch goal) is a heavy install. If you don't need it, remove it from
`requirements.txt` — nothing else depends on it; `generate_embedding()`
degrades gracefully to `None` if it's missing.

## Run

```bash
uvicorn main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

## First-time setup for the demo

```bash
python seed_investigator.py            # creates admin / changeme123 — change this
```

## Connecting the frontend (zero-config)

CORS already allows `http://localhost:3000`. When your friend sends the
frontend zip:

1. Extract it as `frontend/` next to `backend/`
2. In `frontend/.env.local`, set:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. `npm install && npm run dev` in `frontend/` — it will connect immediately.

If `lib/api.ts` uses a different base-URL env var name, just match it to
whatever `NEXT_PUBLIC_API_URL` is set to above — no backend changes needed.

## Live demo script (matches Overview.docx Phase 7)

```bash
# 1. Submit a report with a photo via /docs or the frontend

# 2. Show the chain is currently clean
python verify_chain_cli.py

# 3. Tamper with a report directly in the DB (simulates an attacker)
python3 -c "
from database import SessionLocal
from models import Report
from services.crypto import encrypt_content
db = SessionLocal()
r = db.query(Report).filter(Report.id == 1).first()
r.encrypted_content = encrypt_content('maliciously edited content')
db.commit()
"

# 4. Run verification again — watch it catch the exact break
python verify_chain_cli.py
```

This exact sequence was tested during development and correctly identifies
the tampered record every time.

## Endpoint reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/reports` | none | Submit anonymous report |
| GET | `/reports/{token}/status` | none | Reporter checks own status |
| POST | `/reports/{id}/evidence` | none | Upload + sanitize evidence file |
| GET | `/verify` | none | Verify entire chain |
| GET | `/verify/{report_id}` | none | Verify chain up to a specific report |
| POST | `/investigator/login` | none | Get JWT |
| GET | `/investigator/reports` | JWT | Report queue, sorted by urgency |
| GET | `/investigator/reports/{id}` | JWT | Decrypted report detail |
| PATCH | `/investigator/reports/{id}/status` | JWT | Append-only status update |

## Known limitations (be upfront about these to judges)

- Evidence upload only accepts JPG/PNG/PDF (scoped deliberately — see Phase 2 notes)
- `sentence-transformers` clustering is optional/stretch — not required for core demo
- AI triage falls back to `category: other, urgency: medium, needs_review: true`
  if Ollama isn't running — submission never fails because of this
- Basic auth model for investigators (single shared role) — fine for a hackathon demo,
  would need per-investigator roles/permissions for production
