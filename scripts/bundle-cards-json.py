#!/usr/bin/env python3
"""
cards-new/ 폴더의 52개 SVG 파일을 하나의 JSON 번들로 패키지화
"""
import json
import os
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
CARDS_DIR = PROJECT_ROOT / "src/react-framer/dist/assets/cards-new"
OUTPUT_FILE = PROJECT_ROOT / "assets/cards-bundle.json"

# 제외할 파일 (조커, 두번째 카드 뒷면)
EXCLUDE_FILES = {"2B", "1J", "2J"}

def main():
    cards = {}

    for svg_file in sorted(CARDS_DIR.glob("*.svg")):
        card_id = svg_file.stem
        if card_id in EXCLUDE_FILES:
            continue

        svg_content = svg_file.read_text(encoding='utf-8')
        # XML 선언 제거 (인라인 사용 시 불필요)
        svg_content = svg_content.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n', '')
        svg_content = svg_content.strip()

        # 1B는 "back" 키로 저장
        key = "back" if card_id == "1B" else card_id
        cards[key] = svg_content
        print(f"Added: {key}")

    # JSON 저장
    OUTPUT_FILE.write_text(
        json.dumps(cards, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8'
    )

    print(f"\n번들 생성 완료: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")
    print(f"카드 수: {len(cards)}개")
    print(f"파일 크기: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
