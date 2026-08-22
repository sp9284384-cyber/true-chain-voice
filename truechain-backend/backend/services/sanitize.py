"""
sanitize.py — strips identity-leaking metadata BEFORE anything touches disk.
Runs on every evidence upload. Returns (cleaned_bytes, removed_metadata_log).
"""
import io
import json
from pathlib import Path
from PIL import Image

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:  # pragma: no cover
    from PyPDF2 import PdfReader, PdfWriter


def strip_exif(file_bytes: bytes) -> tuple[bytes, str]:
    """
    Strip EXIF/GPS/device metadata from an image.
    Returns (clean_image_bytes, human-readable log of what was removed).
    """
    img = Image.open(io.BytesIO(file_bytes))
    original_info = dict(img.info)
    removed_keys = list(original_info.keys())

    # Rebuild the image with no metadata — this is the actual strip.
    clean_img = Image.new(img.mode, img.size)
    clean_img.putdata(list(img.getdata()))

    buffer = io.BytesIO()
    save_format = img.format or "PNG"
    clean_img.save(buffer, format=save_format)

    log = f"Removed metadata keys: {removed_keys}" if removed_keys else "No embedded metadata found."
    return buffer.getvalue(), log


def strip_pdf_metadata(file_bytes: bytes) -> tuple[bytes, str]:
    """Strip document info dictionary (author, creation tool, timestamps, etc.) from a PDF."""
    reader = PdfReader(io.BytesIO(file_bytes))
    original_meta = dict(reader.metadata) if reader.metadata else {}

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.add_metadata({})  # explicitly blank metadata

    buffer = io.BytesIO()
    writer.write(buffer)

    log = f"Removed PDF metadata fields: {list(original_meta.keys())}" if original_meta else "No embedded metadata found."
    return buffer.getvalue(), log


def sanitize_file(filename: str, file_bytes: bytes) -> tuple[bytes, str]:
    """
    Dispatches to the right sanitizer based on extension.
    Raises ValueError for unsupported types — enforced again at the router level
    against config.ALLOWED_EVIDENCE_TYPES.
    """
    ext = Path(filename).suffix.lower()
    if ext in (".jpg", ".jpeg", ".png"):
        return strip_exif(file_bytes)
    elif ext == ".pdf":
        return strip_pdf_metadata(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
