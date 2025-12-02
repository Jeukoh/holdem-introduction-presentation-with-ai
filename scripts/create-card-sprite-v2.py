#!/usr/bin/env python3
"""
카드 SVG를 스프라이트로 합치는 스크립트 (심플 버전)
- 각 카드의 내부 구조를 그대로 유지
- 내부 defs의 ID만 카드별로 유니크하게 변경
- 인라인 스프라이트에서 내부 <use> 참조 허용
"""
import re
from pathlib import Path

CARDS_DIR = Path(__file__).parent.parent / "assets" / "cards-new"
OUTPUT_FILE = Path(__file__).parent.parent / "assets" / "cards-sprite.svg"


def process_card_svg(svg_path):
    """카드 SVG 처리: 내부 ID를 유니크하게 변경"""
    card_id = svg_path.stem

    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # viewBox 추출
    viewbox_match = re.search(r'viewBox="([^"]+)"', content)
    viewbox = viewbox_match.group(1) if viewbox_match else "-120 -168 240 336"

    # <svg> 태그 사이의 내용 추출
    inner_match = re.search(r'<svg[^>]*>(.*)</svg>', content, re.DOTALL)
    if not inner_match:
        return None, None

    inner = inner_match.group(1)

    # 내부 ID들을 카드ID_원래ID 형식으로 변경
    # 1. id="..." 패턴
    def replace_id(m):
        old_id = m.group(1)
        return f'id="{card_id}_{old_id}"'

    inner = re.sub(r'id="([^"]+)"', replace_id, inner)

    # 2. href="#..." 패턴 (xlink:href와 href 모두)
    def replace_href(m):
        prefix = m.group(1)
        old_ref = m.group(2)
        return f'{prefix}href="#{card_id}_{old_ref}"'

    inner = re.sub(r'(xlink:)?href="#([^"]+)"', replace_href, inner)

    # 3. url(#...) 패턴 (fill, clip-path 등)
    def replace_url(m):
        old_ref = m.group(1)
        return f'url(#{card_id}_{old_ref})'

    inner = re.sub(r'url\(#([^)]+)\)', replace_url, inner)

    return viewbox, inner


def main():
    all_symbols = []

    svg_files = sorted(CARDS_DIR.glob("*.svg"))
    print(f"Processing {len(svg_files)} SVG files (preserving internal structure)...")

    for svg_path in svg_files:
        card_id = svg_path.stem
        print(f"  Processing: {card_id}")

        try:
            viewbox, inner = process_card_svg(svg_path)
            if inner:
                symbol = f'<symbol id="{card_id}" viewBox="{viewbox}">{inner}</symbol>'
                all_symbols.append(symbol)
        except Exception as e:
            print(f"    Error: {e}")
            continue

    # 카드 뒷면 추가 (1B)
    back_symbol = '''<symbol id="1B" viewBox="-120 -168 240 336">
    <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="#2C5F2D" stroke="#1a3a1a" stroke-width="2"/>
    <rect width="215" height="311" x="-107.5" y="-155.5" rx="8" ry="8" fill="none" stroke="#4a9f4a" stroke-width="1"/>
    <g fill="#4a9f4a" opacity="0.6">
      <circle cx="0" cy="0" r="40"/>
      <path d="M0,-60 L10,-40 L0,-50 L-10,-40 Z M0,60 L10,40 L0,50 L-10,40 Z M-60,0 L-40,10 L-50,0 L-40,-10 Z M60,0 L40,10 L50,0 L40,-10 Z" />
    </g>
  </symbol>'''
    all_symbols.append(back_symbol)

    # 스프라이트 조립
    sprite = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sprite += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
    sprite += 'width="0" height="0" style="position:absolute">\n'
    sprite += '<defs>\n'
    sprite += '\n'.join(all_symbols)
    sprite += '\n</defs>\n'
    sprite += '</svg>'

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sprite)

    print(f"\nSprite saved to: {OUTPUT_FILE}")
    print(f"Total size: {len(sprite):,} bytes")
    print(f"Total symbols: {len(all_symbols)}")


if __name__ == "__main__":
    main()
