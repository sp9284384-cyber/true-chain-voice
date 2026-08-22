"""
Standalone verification script for the live demo — run this instead of curl
for a cleaner on-stage moment:
    python verify_chain_cli.py
"""
from database import SessionLocal
from services.chain_verify import verify_chain


def main():
    db = SessionLocal()
    try:
        result = verify_chain(db)
        print("=" * 50)
        print("TRUECHAIN — HASH CHAIN VERIFICATION")
        print("=" * 50)
        print(f"Records checked : {result['total_records']}")
        print(f"Chain verified  : {'YES ✅' if result['verified'] else 'NO ⚠️  TAMPERING DETECTED'}")
        if not result["verified"]:
            print(f"Broken at report: {result['broken_at_report_id']}")
        print(f"Message         : {result['message']}")
        print("=" * 50)
    finally:
        db.close()


if __name__ == "__main__":
    main()
