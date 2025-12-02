#!/usr/bin/env python3
"""
52장 카드 SVG를 하나의 스프라이트 파일로 합치는 스크립트
- 모든 내부 <use> 참조를 실제 경로로 완전히 플래튼
- 중첩 참조 문제 완전 해결
"""
import xml.etree.ElementTree as ET
from pathlib import Path
from copy import deepcopy

CARDS_DIR = Path(__file__).parent.parent / "assets" / "cards-new"
OUTPUT_FILE = Path(__file__).parent.parent / "assets" / "cards-sprite.svg"

# XML 네임스페이스
NS = {'xlink': 'http://www.w3.org/1999/xlink'}
ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')


def get_tag(elem):
    """네임스페이스 제거한 태그명 반환"""
    tag = elem.tag
    if '}' in tag:
        tag = tag.split('}')[1]
    return tag


def parse_viewbox(viewbox_str):
    """viewBox 문자열 파싱"""
    if not viewbox_str:
        return None
    parts = viewbox_str.split()
    return {
        'x': float(parts[0]),
        'y': float(parts[1]),
        'width': float(parts[2]),
        'height': float(parts[3])
    }


def build_transform(use_elem, symbol_viewbox):
    """use 요소를 위한 transform 문자열 생성"""
    transforms = []

    use_x = float(use_elem.get('x', 0))
    use_y = float(use_elem.get('y', 0))
    use_width = use_elem.get('width')
    use_height = use_elem.get('height')

    if use_x != 0 or use_y != 0:
        transforms.append(f'translate({use_x}, {use_y})')

    if use_width and use_height and symbol_viewbox:
        use_w = float(use_width)
        use_h = float(use_height)
        vb = symbol_viewbox

        scale_x = use_w / vb['width']
        scale_y = use_h / vb['height']

        if scale_x != 1 or scale_y != 1:
            transforms.append(f'scale({scale_x}, {scale_y})')

        if vb['x'] != 0 or vb['y'] != 0:
            transforms.append(f'translate({-vb["x"]}, {-vb["y"]})')

    return ' '.join(transforms)


def extract_all_symbols(root):
    """SVG에서 모든 symbol 정의 추출 (재귀적)"""
    symbols = {}

    def find_symbols(elem):
        for child in list(elem):
            tag = get_tag(child)
            if tag == 'symbol':
                sym_id = child.get('id')
                if sym_id:
                    symbols[sym_id] = child
            find_symbols(child)

    find_symbols(root)
    return symbols


def flatten_element(elem, symbols_dict, card_id, parent=None, index=None):
    """
    요소 자체가 use인 경우 플래튼하고, 자식들도 재귀적으로 처리
    """
    tag = get_tag(elem)

    if tag == 'use':
        # href 찾기
        href = elem.get(f'{{{NS["xlink"]}}}href') or elem.get('href') or ''
        if href.startswith('#'):
            ref_id = href[1:]

            if ref_id in symbols_dict:
                symbol = symbols_dict[ref_id]
                symbol_viewbox = parse_viewbox(symbol.get('viewBox'))

                # <g>로 래핑
                g = ET.Element('g')
                transform = build_transform(elem, symbol_viewbox)
                if transform:
                    g.set('transform', transform)

                # 심볼 자식들 복사 (defs, symbol 제외)
                for sym_child in symbol:
                    sym_tag = get_tag(sym_child)
                    if sym_tag not in ('defs', 'symbol'):
                        cloned = deepcopy(sym_child)
                        g.append(cloned)

                # 부모가 있으면 use를 g로 대체
                if parent is not None and index is not None:
                    parent.remove(elem)
                    parent.insert(index, g)

                    # g 내부도 재귀 플래튼
                    flatten_children(g, symbols_dict, card_id)
                    return g

    # g나 다른 컨테이너 요소의 자식들 처리
    flatten_children(elem, symbols_dict, card_id)
    return elem


def flatten_children(parent, symbols_dict, card_id):
    """부모 요소의 모든 자식을 플래튼"""
    children = list(parent)
    for i, child in enumerate(children):
        # child의 현재 인덱스 찾기
        try:
            current_idx = list(parent).index(child)
        except ValueError:
            continue  # 이미 제거됨
        flatten_element(child, symbols_dict, card_id, parent, current_idx)


def process_card_svg(svg_path):
    """카드 SVG를 완전히 플래튼"""
    card_id = svg_path.stem

    tree = ET.parse(svg_path)
    root = tree.getroot()

    viewbox = root.get('viewBox', '-120 -168 240 336')
    symbols = extract_all_symbols(root)

    # 최상위 콘텐츠 수집
    content_elements = []
    defs_content = []

    for child in root:
        tag = get_tag(child)
        if tag == 'defs':
            # defs에서 pattern, clipPath 등 추출
            for def_child in child:
                def_tag = get_tag(def_child)
                if def_tag in ('pattern', 'clipPath', 'linearGradient', 'radialGradient'):
                    cloned = deepcopy(def_child)
                    old_id = cloned.get('id')
                    if old_id:
                        cloned.set('id', f'{card_id}_{old_id}')
                    defs_content.append(cloned)
        elif tag == 'clipPath':
            cloned = deepcopy(child)
            old_id = cloned.get('id')
            if old_id:
                cloned.set('id', f'{card_id}_{old_id}')
            defs_content.append(cloned)
        else:
            content_elements.append(deepcopy(child))

    # 각 콘텐츠 요소 플래튼
    flattened_content = []
    for elem in content_elements:
        tag = get_tag(elem)
        if tag == 'use':
            # 최상위 use도 플래튼
            href = elem.get(f'{{{NS["xlink"]}}}href') or elem.get('href') or ''
            if href.startswith('#'):
                ref_id = href[1:]
                if ref_id in symbols:
                    symbol = symbols[ref_id]
                    symbol_viewbox = parse_viewbox(symbol.get('viewBox'))

                    g = ET.Element('g')
                    transform = build_transform(elem, symbol_viewbox)
                    if transform:
                        g.set('transform', transform)

                    for sym_child in symbol:
                        sym_tag = get_tag(sym_child)
                        if sym_tag not in ('defs', 'symbol'):
                            cloned = deepcopy(sym_child)
                            g.append(cloned)

                    flatten_children(g, symbols, card_id)
                    flattened_content.append(g)
                else:
                    flattened_content.append(elem)
            else:
                flattened_content.append(elem)
        else:
            flatten_children(elem, symbols, card_id)
            flattened_content.append(elem)

    # url(#id) 참조 업데이트
    def update_url_refs(elem):
        for attr in ['fill', 'stroke', 'clip-path', 'mask']:
            val = elem.get(attr, '')
            if 'url(#' in val:
                import re
                def replace_url(m):
                    ref_id = m.group(1)
                    return f'url(#{card_id}_{ref_id})'
                elem.set(attr, re.sub(r'url\(#([^)]+)\)', replace_url, val))
        for child in elem:
            update_url_refs(child)

    for elem in flattened_content:
        update_url_refs(elem)

    return viewbox, flattened_content, defs_content


def elem_to_string(elem):
    """요소를 문자열로"""
    return ET.tostring(elem, encoding='unicode')


def main():
    all_defs = []
    all_symbols = []

    svg_files = sorted(CARDS_DIR.glob("*.svg"))
    print(f"Processing {len(svg_files)} SVG files with FULL flattening...")

    for svg_path in svg_files:
        card_id = svg_path.stem
        print(f"  Flattening: {card_id}")

        try:
            viewbox, content_elements, defs_content = process_card_svg(svg_path)

            for def_elem in defs_content:
                all_defs.append(elem_to_string(def_elem))

            content_str = ''.join(elem_to_string(e) for e in content_elements)
            symbol = f'<symbol id="{card_id}" viewBox="{viewbox}">{content_str}</symbol>'
            all_symbols.append(symbol)

        except Exception as e:
            print(f"    Error: {e}")
            import traceback
            traceback.print_exc()
            continue

    # 스프라이트 조립
    sprite = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sprite += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
    sprite += 'width="0" height="0" style="position:absolute">\n'
    sprite += '<defs>\n'
    if all_defs:
        sprite += '\n'.join(all_defs) + '\n'
    sprite += '\n'.join(all_symbols)
    sprite += '\n</defs>\n'
    sprite += '</svg>'

    # 후처리: 남아있는 <use> 요소 제거 (디버그/테스트용 요소)
    import re
    # <use .../> 또는 <use ...></use> 패턴 제거
    sprite = re.sub(r'<use[^>]*(?:/>|>[^<]*</use>)', '', sprite)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sprite)

    print(f"\nSprite saved to: {OUTPUT_FILE}")
    print(f"Total size: {len(sprite):,} bytes")

    # 검증: use 요소가 남아있는지 확인
    use_count = sprite.count('<use')
    if use_count > 0:
        print(f"WARNING: {use_count} <use> elements still remain!")
    else:
        print("SUCCESS: All <use> elements have been removed!")


if __name__ == "__main__":
    main()
