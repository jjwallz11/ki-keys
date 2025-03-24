# app/services/receipts.py
import re
from typing import List, Dict
from fastapi import UploadFile
from PyPDF2 import PdfReader

async def extract_keys_from_pdf(file: UploadFile) -> List[Dict[str, int]]:
    reader = PdfReader(file.file)
    full_text = ""

    for page_num, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        print(f"\n📄 PAGE {page_num + 1} TEXT:\n{text}\n")
        full_text += text + "\n"

    lines = [line.strip() for line in full_text.split("\n") if line.strip()]
    print("\n🔍 PDF LINES:")
    for i, line in enumerate(lines):
        print(f"{i:02}: {line}")

    matches = []
    smart_candidate = None
    emergency_candidate = None
    transponder_candidate = None

    for i, line in enumerate(lines):
        line_lower = line.lower()

        if "smart" in line_lower:
            smart_candidate = i
        elif "emergency" in line_lower:
            emergency_candidate = i
        elif "transponder" in line_lower:
            transponder_candidate = i

        if re.match(r"^\d{1,2}$", line):
            quantity = int(line)
            if smart_candidate and i - smart_candidate <= 2:
                matches.append({"key_type": "smart", "quantity": quantity})
                smart_candidate = None
            elif emergency_candidate and i - emergency_candidate <= 2:
                matches.append({"key_type": "emergency", "quantity": quantity})
                emergency_candidate = None
            elif transponder_candidate and i - transponder_candidate <= 2:
                matches.append({"key_type": "transponder", "quantity": quantity})
                transponder_candidate = None

    # 🧠 Merge smart + emergency key pairs
    smart = [m for m in matches if m["key_type"] == "smart"]
    emergency = [m for m in matches if m["key_type"] == "emergency"]
    other = [m for m in matches if m["key_type"] not in {"smart", "emergency"}]

    combined = []

    if smart and emergency:
        smart_qty = sum(m["quantity"] for m in smart)
        emergency_qty = sum(m["quantity"] for m in emergency)
        if smart_qty == emergency_qty:
            combined.append({"key_type": "smart", "quantity": smart_qty})
        else:
            combined.extend(smart)
            combined.extend(emergency)
    elif smart:
        combined.extend(smart)
    elif emergency:
        combined.append({"key_type": "smart", "quantity": 1})
    else:
        combined = matches

    combined.extend(other)

    print("\n✅ FINAL EXTRACTED ITEMS:", combined)
    return combined