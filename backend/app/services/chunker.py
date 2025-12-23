import re
from typing import List, Dict

SECTION_PATTERNS = {
    "summary": r"(summary|profile|about)",
    "experience": r"(experience|work experience|employment)",
    "skills": r"(skills|technical skills|core competencies)",
    "education": r"(education|academic)",
    "projects": r"(projects|personal projects)",
    "certifications": r"(certifications|licenses)"
}


def normalize_text(text: str) -> str:
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def detect_sections(text: str) -> Dict[str, str]:
    sections = {}
    current_section = "other"
    buffer = []

    lines = text.split("\n")

    for line in lines:
        clean_line = line.strip().lower()

        matched = False
        for section, pattern in SECTION_PATTERNS.items():
            if re.fullmatch(pattern, clean_line):
                if buffer:
                    sections[current_section] = "\n".join(buffer).strip()
                current_section = section
                buffer = []
                matched = True
                break

        if not matched:
            buffer.append(line)

    if buffer:
        sections[current_section] = "\n".join(buffer).strip()

    return sections


def create_chunks(text: str) -> List[Dict]:
    text = normalize_text(text)
    sections = detect_sections(text)

    chunks = []
    order = 0

    for section, content in sections.items():
        if not content:
            continue

        chunks.append({
            "section": section,
            "content": content,
            "order": order
        })
        order += 1

    return chunks
