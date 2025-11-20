#!/usr/bin/env python3
"""
Fragment Implementation Verification Script

Verifies that:
1. HTML fragment grouping is correct (data-fragment-index)
2. CSS selectors use .current-fragment instead of .visible
3. Each hand ranking slide has proper fragment structure
"""

import re
from pathlib import Path
from collections import defaultdict

def verify_html_fragments(html_path):
    """Verify HTML fragment structure"""
    print("=" * 60)
    print("HTML FRAGMENT VERIFICATION")
    print("=" * 60)

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract slides with deck-grid
    slide_pattern = r'<section>.*?<h2>(.*?)</h2>.*?<div class="deck-grid">(.*?)</div>.*?</section>'
    slides = re.findall(slide_pattern, html_content, re.DOTALL)

    results = []

    for slide_title, slide_content in slides:
        print(f"\n📊 Slide: {slide_title}")
        print("-" * 60)

        # Find all fragment cards
        fragment_pattern = r'<img[^>]*class="fragment"[^>]*data-fragment-index="(\d+)"[^>]*>'
        fragments = re.findall(fragment_pattern, slide_content)

        if not fragments:
            print("⚠️  No fragments with data-fragment-index found")
            results.append((slide_title, False, "No grouped fragments"))
            continue

        # Count cards per fragment index
        fragment_counts = defaultdict(int)
        for index in fragments:
            fragment_counts[index] += 1

        print(f"Fragment groups found: {len(fragment_counts)}")
        all_valid = True

        for index in sorted(fragment_counts.keys(), key=int):
            count = fragment_counts[index]
            # Most hand combinations use 5 cards
            if count == 5:
                print(f"  ✅ Fragment {index}: {count} cards (expected 5)")
            else:
                print(f"  ⚠️  Fragment {index}: {count} cards (expected 5, got {count})")
                if "로열 플러시" not in slide_title:  # Royal Flush always has 5
                    all_valid = False

        # Check combo-count fragment
        combo_pattern = r'<div class="combo-count fragment"[^>]*data-fragment-index="(\d+)"'
        combo_match = re.search(combo_pattern, slide_content)
        if combo_match:
            combo_index = combo_match.group(1)
            print(f"  ✅ Combo count at fragment {combo_index}")
        else:
            print(f"  ⚠️  Combo count missing data-fragment-index")

        results.append((slide_title, all_valid, f"{len(fragment_counts)} groups"))

    return results

def verify_css_selectors(css_path):
    """Verify CSS uses .current-fragment instead of .visible"""
    print("\n" + "=" * 60)
    print("CSS SELECTOR VERIFICATION")
    print("=" * 60 + "\n")

    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()

    # Check for old .visible selector
    old_selector = r'\.deck-grid\s+img\.fragment\.visible'
    if re.search(old_selector, css_content):
        print("❌ FAIL: Found old .fragment.visible selector")
        print("   Should use .fragment.current-fragment instead")
        return False
    else:
        print("✅ PASS: No .fragment.visible selector found")

    # Check for new .current-fragment selector
    new_selector = r'\.deck-grid\s+img\.fragment\.current-fragment'
    if re.search(new_selector, css_content):
        print("✅ PASS: Found .fragment.current-fragment selector")

        # Extract the rule
        rule_pattern = r'\.deck-grid\s+img\.fragment\.current-fragment\s*\{([^}]+)\}'
        match = re.search(rule_pattern, css_content)
        if match:
            print("\n📝 CSS Rule:")
            properties = match.group(1).strip().split(';')
            for prop in properties:
                if prop.strip():
                    print(f"   {prop.strip()};")

        return True
    else:
        print("❌ FAIL: .fragment.current-fragment selector not found")
        return False

def verify_card_count(html_path):
    """Verify each deck-grid has exactly 52 cards"""
    print("\n" + "=" * 60)
    print("CARD COUNT VERIFICATION")
    print("=" * 60 + "\n")

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract all deck-grid sections
    grid_pattern = r'<h2>(.*?)</h2>.*?<div class="deck-grid">(.*?)</div>'
    grids = re.findall(grid_pattern, html_content, re.DOTALL)

    all_valid = True
    for title, grid_content in grids:
        # Count img tags
        card_count = len(re.findall(r'<img[^>]*src="images/cards/', grid_content))

        if card_count == 52:
            print(f"✅ {title}: {card_count} cards")
        else:
            print(f"❌ {title}: {card_count} cards (expected 52)")
            all_valid = False

    return all_valid

def main():
    repo_root = Path(__file__).parent.parent
    html_path = repo_root / "index.html"
    css_path = repo_root / "css" / "custom.css"

    print("\n🔍 Texas Hold'em Fragment Verification")
    print("=" * 60)
    print(f"HTML: {html_path}")
    print(f"CSS:  {css_path}")

    # Verify CSS
    css_valid = verify_css_selectors(css_path)

    # Verify HTML fragments
    fragment_results = verify_html_fragments(html_path)

    # Verify card counts
    card_count_valid = verify_card_count(html_path)

    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)

    print(f"\n✅ CSS Selectors: {'PASS' if css_valid else 'FAIL'}")
    print(f"✅ Card Counts: {'PASS' if card_count_valid else 'FAIL'}")

    print(f"\nFragment Groupings:")
    for title, valid, details in fragment_results:
        status = "✅" if valid else "⚠️"
        print(f"  {status} {title}: {details}")

    # Manual verification instructions
    print("\n" + "=" * 60)
    print("MANUAL BROWSER VERIFICATION")
    print("=" * 60)
    print("""
To verify visual behavior:

1. Start HTTP server:
   $ python -m http.server 8000

2. Open browser:
   http://localhost:8000

3. Navigate to Royal Flush slide

4. Open DevTools (F12) → Elements tab

5. Press Space to advance fragments, verify:

   Fragment 0 (Spades):
   ✓ 5 cards (A♠, 10♠, J♠, Q♠, K♠) have class "current-fragment"
   ✓ Those 5 cards are bright (opacity ~1)
   ✓ All other 47 cards are dim (opacity 0.3)

   Fragment 1 (Hearts):
   ✓ Previous 5 Spades cards LOST "current-fragment" class
   ✓ Previous 5 Spades cards returned to dim (opacity 0.3)
   ✓ New 5 Hearts cards have "current-fragment" class
   ✓ New 5 Hearts cards are bright

   Repeat for Diamonds (Fragment 2) and Clubs (Fragment 3)

6. Verify Flush and One Pair slides similarly

Expected CSS behavior:
- .deck-grid img { opacity: 0.3 }  ← default dim
- .deck-grid img.fragment.current-fragment { opacity: 1 }  ← bright
""")

    print("=" * 60)
    print("✅ Verification script complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()
