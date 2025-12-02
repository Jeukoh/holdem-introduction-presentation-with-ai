#!/usr/bin/env python3
"""
카드 SVG를 스프라이트로 합치는 스크립트 (v4)
- <symbol> 대신 <g>를 사용하여 nested use 문제 해결
- viewBox 변환을 g의 transform으로 처리
- 카드 참조시 transform으로 viewBox 시뮬레이션
"""
import re
from pathlib import Path

CARDS_DIR = Path(__file__).parent.parent / "assets" / "cards-new"
OUTPUT_FILE = Path(__file__).parent.parent / "assets" / "cards-sprite.svg"

# 표준 카드 viewBox
CARD_VIEWBOX = "-120 -168 240 336"


def process_card_svg(svg_path):
    """카드 SVG 처리"""
    card_id = svg_path.stem

    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # viewBox 추출
    viewbox_match = re.search(r'viewBox="([^"]+)"', content)
    viewbox = viewbox_match.group(1) if viewbox_match else CARD_VIEWBOX

    # <svg> 태그 사이의 내용 추출
    inner_match = re.search(r'<svg[^>]*>(.*)</svg>', content, re.DOTALL)
    if not inner_match:
        return None, None, []

    inner = inner_match.group(1)

    # 내부 defs 추출
    extracted_defs = []

    # <defs>...</defs> 블록 찾기
    defs_pattern = r'<defs>(.*?)</defs>'
    defs_matches = re.findall(defs_pattern, inner, re.DOTALL)

    for defs_content in defs_matches:
        # ID를 카드별로 유니크하게 변경
        def replace_id(m):
            old_id = m.group(1)
            return f'id="{card_id}_{old_id}"'

        defs_content_prefixed = re.sub(r'id="([^"]+)"', replace_id, defs_content)
        extracted_defs.append(defs_content_prefixed)

    # <defs>...</defs> 블록 제거
    inner = re.sub(defs_pattern, '', inner, flags=re.DOTALL)

    # 상위 레벨의 clipPath도 추출
    clippath_pattern = r'(<clipPath[^>]*>.*?</clipPath>)'
    clippath_matches = re.findall(clippath_pattern, inner, re.DOTALL)
    for clippath in clippath_matches:
        def replace_id_clip(m):
            old_id = m.group(1)
            return f'id="{card_id}_{old_id}"'
        clippath_prefixed = re.sub(r'id="([^"]+)"', replace_id_clip, clippath)
        extracted_defs.append(clippath_prefixed)

    # clipPath 제거
    inner = re.sub(clippath_pattern, '', inner, flags=re.DOTALL)

    # href 참조 업데이트
    def replace_href(m):
        prefix = m.group(1) or ''
        old_ref = m.group(2)
        return f'{prefix}href="#{card_id}_{old_ref}"'

    inner = re.sub(r'(xlink:)?href="#([^"]+)"', replace_href, inner)

    # url(#...) 참조 업데이트
    def replace_url(m):
        old_ref = m.group(1)
        return f'url(#{card_id}_{old_ref})'

    inner = re.sub(r'url\(#([^)]+)\)', replace_url, inner)

    return viewbox, inner.strip(), extracted_defs


def main():
    all_global_defs = []  # 전역 defs
    all_groups = []       # 카드 그룹들

    svg_files = sorted(CARDS_DIR.glob("*.svg"))
    print(f"Processing {len(svg_files)} SVG files...")

    for svg_path in svg_files:
        card_id = svg_path.stem
        print(f"  Processing: {card_id}")

        try:
            viewbox, inner, extracted_defs = process_card_svg(svg_path)
            if inner:
                # 추출된 defs를 전역 목록에 추가
                all_global_defs.extend(extracted_defs)

                # <g> 요소로 카드 생성 (symbol 대신)
                # viewBox 정보를 data 속성으로 저장 (JS에서 사용)
                group = f'<g id="{card_id}" data-viewbox="{viewbox}">{inner}</g>'
                all_groups.append(group)
        except Exception as e:
            print(f"    Error: {e}")
            import traceback
            traceback.print_exc()
            continue

    # 카드 뒷면 추가
    back_group = '''<g id="1B" data-viewbox="-120 -168 240 336">
    <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="#2C5F2D" stroke="#1a3a1a" stroke-width="2"/>
    <rect width="215" height="311" x="-107.5" y="-155.5" rx="8" ry="8" fill="none" stroke="#4a9f4a" stroke-width="1"/>
    <g fill="#4a9f4a" opacity="0.6">
      <circle cx="0" cy="0" r="40"/>
      <path d="M0,-60 L10,-40 L0,-50 L-10,-40 Z M0,60 L10,40 L0,50 L-10,40 Z M-60,0 L-40,10 L-50,0 L-40,-10 Z M60,0 L40,10 L50,0 L40,-10 Z" />
    </g>
  </g>'''

    # 1B가 이미 있으면 스킵
    if not any('id="1B"' in g for g in all_groups):
        all_groups.append(back_group)

    # 스프라이트 조립
    sprite = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sprite += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
    sprite += 'width="0" height="0" style="position:absolute">\n'
    sprite += '<defs>\n'

    # 전역 defs
    if all_global_defs:
        sprite += '<!-- Shared definitions -->\n'
        sprite += '\n'.join(all_global_defs)
        sprite += '\n'

    # 카드 그룹들
    sprite += '<!-- Card groups -->\n'
    sprite += '\n'.join(all_groups)
    sprite += '\n</defs>\n'
    sprite += '</svg>'

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sprite)

    print(f"\nSprite saved to: {OUTPUT_FILE}")
    print(f"Total size: {len(sprite):,} bytes")
    print(f"Total global defs: {len(all_global_defs)}")
    print(f"Total card groups: {len(all_groups)}")


if __name__ == "__main__":
    main()
