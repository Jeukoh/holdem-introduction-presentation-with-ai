# Diagram Elements Usage Guide

This guide documents all reusable SVG diagram elements for the Texas Hold'em presentation. Each element is designed to be composable and can be used in various combinations to create effective visual explanations.

## Table of Contents
- [Game Components](#game-components)
- [Action Badges](#action-badges)
- [Indicators](#indicators)
- [Comparison Templates](#comparison-templates)
- [Hand & Strategy Visualizations](#hand--strategy-visualizations)
- [Full Illustrations](#full-illustrations)
- [Usage Examples](#usage-examples)

---

## Game Components

### 1. Chip Stack (`elements/chips/chip-stack.svg`)
**Description:** A stack of 5 poker chips with different colors representing standard denominations ($5, $10, $25, $100, $500).

**Usage in Presentation:**
- 베팅 개념 설명 (Betting concepts)
- 스택 크기 비교 (Stack size comparison)
- 팟 사이즈 시각화 (Pot size visualization)

**Example:**
```html
<img src="images/elements/chips/chip-stack.svg" width="100">
```

**Used in Sections:**
- "베팅 라운드" (Betting rounds)
- "팟 오즈 계산" (Pot odds calculation)

---

### 2. Pot Icon (`elements/chips/pot-icon.svg`)
**Description:** A messy pile of multi-colored chips representing the pot.

**Usage in Presentation:**
- 팟 오즈 계산 시각화 (Pot odds visualization)
- 팟 크기 표시 (Showing pot size)
- 상금 개념 설명 (Prize pool explanation)

**Example:**
```html
<img src="images/elements/chips/pot-icon.svg" width="120">
<p>Current Pot: $150</p>
```

**Used in Sections:**
- "팟 오즈란?" (What are pot odds?)
- "EV 계산" (EV calculation)

---

### 3. Player Seat (`elements/templates/player-seat.svg`)
**Description:** A circular player position marker with seat number placeholder.

**Usage in Presentation:**
- 플레이어 위치 표시 (Player position marking)
- 포지션 설명 (Position explanation)
- 멀티플레이어 시나리오 (Multi-player scenarios)

**Example:**
```html
<div style="position: relative;">
  <img src="images/elements/templates/player-seat.svg" width="80">
  <span style="position: absolute; top: 30px; left: 30px;">1</span>
</div>
```

**Used in Sections:**
- "테이블 구조" (Table structure)
- "포지션의 중요성" (Importance of position)

---

### 4. Card Placeholder (`elements/templates/card-placeholder.svg`)
**Description:** A dashed outline representing an empty card slot.

**Usage in Presentation:**
- 미래 카드 표시 (Future cards)
- 카드 배치 설명 (Card placement explanation)
- 드로우 가능성 시각화 (Draw possibilities)

**Example:**
```html
<img src="images/cards/AS.svg" width="60">
<img src="images/cards/KS.svg" width="60">
<img src="images/elements/templates/card-placeholder.svg" width="60">
<img src="images/elements/templates/card-placeholder.svg" width="60">
<img src="images/elements/templates/card-placeholder.svg" width="60">
```

**Used in Sections:**
- "커뮤니티 카드" (Community cards)
- "드로우 핸드" (Draw hands)

---

### 5. Community Card Area (`elements/templates/community-card-area.svg`)
**Description:** A template showing 5 card slots with FLOP, TURN, RIVER labels.

**Usage in Presentation:**
- 베팅 라운드 설명 (Betting rounds explanation)
- 게임 진행 단계 (Game progression stages)
- 카드 공개 타이밍 (Card reveal timing)

**Example:**
```html
<img src="images/elements/templates/community-card-area.svg" width="500">
```

**Used in Sections:**
- "게임 진행 순서" (Game flow)
- "플랍, 턴, 리버" (Flop, Turn, River)

---

### 6. Betting Arrow (`elements/indicators/betting-arrow.svg`)
**Description:** A curved arrow with "BET" label showing betting direction.

**Usage in Presentation:**
- 베팅 액션 표시 (Showing betting action)
- 베팅 순서 표시 (Betting order)
- 돈의 흐름 시각화 (Money flow visualization)

**Example:**
```html
<img src="images/elements/templates/player-seat.svg" width="60">
<img src="images/elements/indicators/betting-arrow.svg" width="100">
<img src="images/elements/chips/pot-icon.svg" width="100">
```

**Used in Sections:**
- "베팅 액션" (Betting actions)
- "베팅 라운드" (Betting rounds)

---

### 7. Dealer Button (`elements/decorative/dealer-button.svg`)
**Description:** A circular dealer button with "D" marking.

**Usage in Presentation:**
- 딜러 위치 표시 (Dealer position)
- 포지션 설명 (Position explanation)
- 베팅 순서 설명 (Betting order explanation)

**Example:**
```html
<img src="images/elements/decorative/dealer-button.svg" width="50">
```

**Used in Sections:**
- "딜러 버튼과 블라인드" (Dealer button and blinds)
- "포지션" (Position)

---

## Action Badges

### 8. FOLD Badge (`elements/actions/action-fold.svg`)
**Description:** Red badge with "FOLD" text.

**Usage in Presentation:**
- 폴드 액션 설명 (Fold action explanation)
- 액션 선택지 표시 (Action options)
- 의사결정 트리 (Decision tree)

**Used in Sections:**
- "기본 액션" (Basic actions)
- "의사결정" (Decision making)

---

### 9. CALL Badge (`elements/actions/action-call.svg`)
**Description:** Blue badge with "CALL" text.

**Usage in Presentation:**
- 콜 액션 설명 (Call action explanation)
- 패시브 플레이 (Passive play)
- 팟 오즈 의사결정 (Pot odds decision)

**Used in Sections:**
- "기본 액션" (Basic actions)
- "팟 오즈 활용" (Using pot odds)

---

### 10. RAISE Badge (`elements/actions/action-raise.svg`)
**Description:** Green badge with "RAISE" text.

**Usage in Presentation:**
- 레이즈 액션 설명 (Raise action explanation)
- 공격적 플레이 (Aggressive play)
- 밸류 베팅 (Value betting)

**Used in Sections:**
- "기본 액션" (Basic actions)
- "베팅 전략" (Betting strategy)

---

### 11. Thinking Bubble (`elements/actions/thinking-bubble.svg`)
**Description:** Speech bubble with question mark.

**Usage in Presentation:**
- 의사결정 순간 표시 (Decision moment)
- 전략적 사고 표현 (Strategic thinking)
- 퀴즈/질문 표시 (Quiz/question marker)

**Used in Sections:**
- "전략적 사고" (Strategic thinking)
- "의사결정 프로세스" (Decision process)

---

### 12. Winner Badge (`elements/actions/winner-badge.svg`)
**Description:** Gold star with crown.

**Usage in Presentation:**
- 승자 표시 (Winner indication)
- 최고의 플레이 강조 (Best play highlight)
- 성공 사례 (Success case)

**Used in Sections:**
- "핸드 비교" (Hand comparison)
- "쇼다운" (Showdown)

---

## Indicators

### 13. Percentage Badge (`elements/indicators/percentage-badge.svg`)
**Description:** Circular badge displaying percentage (template).

**Usage in Presentation:**
- 승률 표시 (Win rate display)
- 확률 시각화 (Probability visualization)
- 통계 데이터 표시 (Statistics display)

**Example:**
```html
<!-- Can overlay text on the badge -->
<div style="position: relative;">
  <img src="images/elements/indicators/percentage-badge.svg" width="80">
  <span style="position: absolute; top: 28px; left: 24px; font-size: 18px; font-weight: bold; color: white;">65%</span>
</div>
```

**Used in Sections:**
- "승률 계산" (Win rate calculation)
- "확률 기반 의사결정" (Probability-based decisions)

---

### 14. +EV Indicator (`elements/indicators/ev-indicator.svg`)
**Description:** Green pill-shaped badge with "+EV" text.

**Usage in Presentation:**
- 긍정적 기댓값 표시 (Positive expected value)
- 좋은 플레이 강조 (Good play highlight)
- 수익성 있는 결정 (Profitable decision)

**Example:**
```html
<img src="images/elements/actions/action-call.svg" width="100">
<img src="images/elements/indicators/ev-indicator.svg" width="90">
```

**Used in Sections:**
- "기댓값(EV) 이해하기" (Understanding EV)
- "수익성 있는 플레이" (Profitable plays)

---

### 15. Odds Ratio (`elements/indicators/odds-ratio.svg`)
**Description:** Dark box displaying ratio like "3:1".

**Usage in Presentation:**
- 팟 오즈 표시 (Pot odds display)
- 비율 계산 설명 (Ratio calculation)
- 오즈 비교 (Odds comparison)

**Example:**
```html
<p>Pot Odds:</p>
<img src="images/elements/indicators/odds-ratio.svg" width="100">
```

**Used in Sections:**
- "팟 오즈 계산" (Pot odds calculation)
- "임플라이드 오즈" (Implied odds)

---

### 16. Checkmark Icon (`elements/indicators/checkmark-icon.svg`)
**Description:** Green circle with white checkmark.

**Usage in Presentation:**
- 올바른 플레이 표시 (Correct play)
- 긍정적 결과 (Positive outcome)
- 체크리스트 항목 (Checklist item)

**Used in Sections:**
- "좋은 플레이 예시" (Good play examples)
- "학습 체크포인트" (Learning checkpoints)

---

### 17. X-Mark Icon (`elements/indicators/x-mark-icon.svg`)
**Description:** Red circle with white X.

**Usage in Presentation:**
- 잘못된 플레이 표시 (Incorrect play)
- 부정적 결과 (Negative outcome)
- 피해야 할 행동 (Actions to avoid)

**Used in Sections:**
- "흔한 실수" (Common mistakes)
- "나쁜 플레이 예시" (Bad play examples)

---

### 18. Warning Icon (`elements/indicators/warning-icon.svg`)
**Description:** Yellow triangle with exclamation mark.

**Usage in Presentation:**
- 주의 사항 (Caution)
- 위험 신호 (Danger signal)
- 중요 포인트 강조 (Important point highlight)

**Used in Sections:**
- "주의사항" (Warnings)
- "틸트 방지" (Avoiding tilt)

---

## Comparison Templates

### 19. VS Divider (`elements/templates/vs-divider.svg`)
**Description:** Red circular badge with "VS" text for comparisons.

**Usage in Presentation:**
- 핸드 vs 핸드 비교 (Hand vs hand comparison)
- 전략 비교 (Strategy comparison)
- 대결 시나리오 (Confrontation scenario)

**Example:**
```html
<div style="display: flex; align-items: center; gap: 20px;">
  <img src="images/cards/AS.svg" width="60">
  <img src="images/cards/AH.svg" width="60">
  <img src="images/elements/templates/vs-divider.svg" width="80">
  <img src="images/cards/KC.svg" width="60">
  <img src="images/cards/KD.svg" width="60">
</div>
```

**Used in Sections:**
- "핸드 매치업" (Hand matchups)
- "전략 비교" (Strategy comparison)

---

### 20. Comparison Table Template (`elements/templates/comparison-table-template.svg`)
**Description:** Two-column comparison table with headers "Option A" and "Option B".

**Usage in Presentation:**
- 전략 비교 (Strategy comparison)
- 장단점 분석 (Pros/cons analysis)
- 선택지 비교 (Options comparison)

**Example:**
```html
<img src="images/elements/templates/comparison-table-template.svg" width="500">
<!-- Overlay text on the white boxes for actual comparison content -->
```

**Used in Sections:**
- "GTO vs Exploit" (GTO vs Exploit)
- "캐시게임 vs 토너먼트" (Cash game vs Tournament)

---

### 21. Pro/Con Boxes (`elements/templates/pro-con-boxes.svg`)
**Description:** Side-by-side boxes with green checkmarks (pros) and red X marks (cons).

**Usage in Presentation:**
- 장점/단점 분석 (Pros/cons analysis)
- 의사결정 고려사항 (Decision considerations)
- 전략 평가 (Strategy evaluation)

**Example:**
```html
<img src="images/elements/templates/pro-con-boxes.svg" width="600">
<!-- Add text overlays on the gray lines for actual content -->
```

**Used in Sections:**
- "블러핑 장단점" (Bluffing pros/cons)
- "포지션별 플레이" (Playing by position)

---

## Hand & Strategy Visualizations

### 22. Hand Strength Bar (`elements/visualizations/hand-strength-bar.svg`)
**Description:** Horizontal bar with gradient (red→yellow→green) showing hand strength percentage.

**Usage in Presentation:**
- 핸드 강도 시각화 (Hand strength visualization)
- 승률 표시 (Win rate display)
- 상대적 강도 비교 (Relative strength comparison)

**Example:**
```html
<img src="images/elements/visualizations/hand-strength-bar.svg" width="400">
<!-- Bar shows 70% as example -->
```

**Used in Sections:**
- "핸드 평가" (Hand evaluation)
- "에퀴티 계산" (Equity calculation)

---

### 23. Range Grid (Empty) (`elements/visualizations/range-grid-empty.svg`)
**Description:** Empty 13×13 grid for creating custom hand range selections.

**Usage in Presentation:**
- 커스텀 핸드 레인지 표시 (Custom hand range display)
- 포지션별 레인지 (Range by position)
- 상황별 오픈 레인지 (Opening range by situation)

**Example:**
```html
<div style="position: relative;">
  <img src="images/elements/visualizations/range-grid-empty.svg" width="520">
  <!-- Overlay colored rectangles for selected ranges using CSS -->
</div>
```

**Used in Sections:**
- "오픈 레이징 레인지" (Opening raising range)
- "3bet 레인지" (3-bet range)

**Note:** For a pre-filled example, see `/images/hand-rankings.svg` which shows a complete preflop starting hands chart with color-coded strength.

---

### 24. Position Diagram (`elements/visualizations/position-diagram.svg`)
**Description:** 9-handed poker table showing positions (UTG, MP, HJ, CO, BTN, SB, BB) with color coding.

**Usage in Presentation:**
- 포지션 설명 (Position explanation)
- 포지션별 전략 (Strategy by position)
- 테이블 다이나믹스 (Table dynamics)

**Color Legend:**
- Gray: Early position (worst)
- Orange: Late position (good)
- Red: Button (best)
- Blue: Blinds

**Used in Sections:**
- "포지션의 중요성" (Importance of position)
- "포지션별 플레이" (Playing by position)

---

### 25. GTO/Exploit Icons (`elements/visualizations/gto-exploit-icon.svg`)
**Description:** Two side-by-side icons showing GTO (balance scales) vs Exploit (target) modes.

**Usage in Presentation:**
- 전략 접근법 비교 (Strategy approach comparison)
- GTO 개념 설명 (GTO concept explanation)
- Exploit 플레이 설명 (Exploit play explanation)

**Used in Sections:**
- "GTO 전략" (GTO strategy)
- "상대 약점 공략" (Exploiting opponent weaknesses)

---

## Full Illustrations

These are complete, standalone images (not elements to be composed):

### 26. Hand Rankings Chart (`hand-rankings.svg`)
**Description:** Complete 13×13 preflop starting hands chart with color-coded strength.

**Color Legend:**
- Dark Green: Premium hands (AA, KK, QQ, AKs)
- Medium Green: Strong hands
- Yellow: Playable hands
- Orange: Marginal hands
- Light Orange: Weak hands

**Usage in Presentation:**
- Preflop 전략 (Preflop strategy)
- 시작 핸드 선택 (Starting hand selection)
- 포지션별 오픈 레인지 (Opening range by position)

**Used in Sections:**
- "시작 핸드 선택" (Starting hand selection)
- "포지션별 플레이" (Playing by position)

---

### 27. Poker Table (`poker-table.svg`)
**Description:** 3-player poker table background with green felt.

**Usage in Presentation:**
- 배경 이미지 (Background image)
- 게임 시나리오 설명 (Game scenario explanation)
- 플레이어 배치 (Player positioning)

**Used in Sections:**
- "게임 소개" (Game introduction)
- "실전 예시" (Practical examples)

---

### 28. Card Suits Icon (`card-suits-icon.svg`)
**Description:** All four card suits (♠♥♦♣) arranged in a grid.

**Usage in Presentation:**
- 슈트 설명 (Suit explanation)
- 카드 개념 소개 (Card concept introduction)
- 장식 요소 (Decorative element)

**Used in Sections:**
- "기본 규칙" (Basic rules)
- "카드 이해하기" (Understanding cards)

---

### 29. Playing Cards (`cards/*.svg`)
**Description:** Complete deck of 52 cards + 1 card back.

**Naming Convention:**
- Ranks: A, 2-9, T (10), J, Q, K
- Suits: S (Spades), H (Hearts), D (Diamonds), C (Clubs)
- Examples: `AS.svg` (Ace of Spades), `KH.svg` (King of Hearts)
- Back: `back.svg`

**Usage in Presentation:**
- 핸드 예시 (Hand examples)
- 커뮤니티 카드 표시 (Community cards display)
- 게임 시나리오 (Game scenarios)

**Used in Sections:**
- All sections showing specific card combinations

---

## Usage Examples

### Example 1: Pot Odds Decision Scenario

```html
<div class="scenario">
  <h3>팟 오즈 계산 예시</h3>

  <!-- Player's hand -->
  <div class="hand">
    <img src="images/cards/AH.svg" width="60">
    <img src="images/cards/KH.svg" width="60">
  </div>

  <!-- Community cards -->
  <div class="board">
    <img src="images/cards/QH.svg" width="60">
    <img src="images/cards/JH.svg" width="60">
    <img src="images/cards/7C.svg" width="60">
    <img src="images/elements/templates/card-placeholder.svg" width="60">
    <img src="images/elements/templates/card-placeholder.svg" width="60">
  </div>

  <!-- Pot and odds -->
  <div class="pot-info">
    <img src="images/elements/chips/pot-icon.svg" width="100">
    <p>Pot: $100</p>
    <img src="images/elements/indicators/odds-ratio.svg" width="100">
    <p>Pot Odds: 3:1</p>
  </div>

  <!-- Decision -->
  <div class="decision">
    <img src="images/elements/actions/action-call.svg" width="100">
    <img src="images/elements/indicators/ev-indicator.svg" width="90">
    <img src="images/elements/indicators/checkmark-icon.svg" width="60">
  </div>
</div>
```

---

### Example 2: Position Comparison

```html
<div class="position-comparison">
  <h3>포지션별 오픈 레인지 비교</h3>

  <div style="display: flex; gap: 40px;">
    <!-- Early Position -->
    <div>
      <h4>UTG (Early)</h4>
      <img src="images/hand-rankings.svg" width="300">
      <!-- Highlight only premium hands -->
      <p>Tight range: Only strong hands</p>
      <img src="images/elements/indicators/warning-icon.svg" width="40">
    </div>

    <img src="images/elements/templates/vs-divider.svg" width="80">

    <!-- Button Position -->
    <div>
      <h4>BTN (Button)</h4>
      <img src="images/hand-rankings.svg" width="300">
      <!-- Highlight wider range -->
      <p>Wide range: Many playable hands</p>
      <img src="images/elements/indicators/checkmark-icon.svg" width="40">
    </div>
  </div>
</div>
```

---

### Example 3: GTO vs Exploit Strategy

```html
<div class="strategy-comparison">
  <h3>GTO vs Exploit 전략 비교</h3>

  <img src="images/elements/visualizations/gto-exploit-icon.svg" width="300">

  <img src="images/elements/templates/pro-con-boxes.svg" width="600">

  <!-- Add text content for each strategy's pros/cons -->
</div>
```

---

### Example 4: Hand Matchup

```html
<div class="hand-matchup">
  <h3>Preflop All-in 매치업</h3>

  <div style="display: flex; align-items: center; gap: 30px;">
    <!-- Player 1 -->
    <div>
      <p>Player 1</p>
      <img src="images/cards/AS.svg" width="70">
      <img src="images/cards/AH.svg" width="70">
      <img src="images/elements/indicators/percentage-badge.svg" width="80">
      <p>82%</p>
    </div>

    <!-- VS -->
    <img src="images/elements/templates/vs-divider.svg" width="100">

    <!-- Player 2 -->
    <div>
      <p>Player 2</p>
      <img src="images/cards/KD.svg" width="70">
      <img src="images/cards/KC.svg" width="70">
      <img src="images/elements/indicators/percentage-badge.svg" width="80">
      <p>18%</p>
    </div>
  </div>

  <img src="images/elements/visualizations/hand-strength-bar.svg" width="400">
</div>
```

---

### Example 5: Action Decision Tree

```html
<div class="decision-tree">
  <h3>의사결정 프로세스</h3>

  <!-- Scenario -->
  <div class="scenario">
    <img src="images/elements/actions/thinking-bubble.svg" width="80">
    <p>상대방이 $50을 베팅했습니다</p>
  </div>

  <!-- Options -->
  <div class="options" style="display: flex; gap: 20px;">
    <!-- Fold -->
    <div>
      <img src="images/elements/actions/action-fold.svg" width="100">
      <img src="images/elements/indicators/x-mark-icon.svg" width="50">
      <p>-EV: 드로우 가능성 있음</p>
    </div>

    <!-- Call -->
    <div>
      <img src="images/elements/actions/action-call.svg" width="100">
      <img src="images/elements/indicators/checkmark-icon.svg" width="50">
      <p>+EV: 팟 오즈 충분</p>
      <img src="images/elements/indicators/ev-indicator.svg" width="90">
    </div>

    <!-- Raise -->
    <div>
      <img src="images/elements/actions/action-raise.svg" width="100">
      <img src="images/elements/indicators/warning-icon.svg" width="50">
      <p>위험: 드로우는 레이즈 부적합</p>
    </div>
  </div>
</div>
```

---

## Combining Elements

The power of these elements comes from combining them creatively. Here are recommended combinations:

1. **Betting Scenario:**
   - Player Seat + Betting Arrow + Pot Icon + Chip Stack

2. **Decision Point:**
   - Thinking Bubble + Action Badges (Fold/Call/Raise) + Checkmark/X-Mark Icons

3. **Hand Analysis:**
   - Card Images + Hand Strength Bar + Percentage Badge + EV Indicator

4. **Strategy Comparison:**
   - VS Divider + Comparison Table + Pro-Con Boxes + Checkmark/X-Mark Icons

5. **Position Play:**
   - Position Diagram + Hand Rankings Chart + Range Grid + Warning/Checkmark Icons

---

## File Organization

```
images/
├── elements/
│   ├── chips/
│   │   ├── chip-stack.svg
│   │   └── pot-icon.svg
│   ├── actions/
│   │   ├── action-fold.svg
│   │   ├── action-call.svg
│   │   ├── action-raise.svg
│   │   ├── thinking-bubble.svg
│   │   └── winner-badge.svg
│   ├── indicators/
│   │   ├── betting-arrow.svg
│   │   ├── percentage-badge.svg
│   │   ├── ev-indicator.svg
│   │   ├── odds-ratio.svg
│   │   ├── checkmark-icon.svg
│   │   ├── x-mark-icon.svg
│   │   └── warning-icon.svg
│   ├── templates/
│   │   ├── player-seat.svg
│   │   ├── card-placeholder.svg
│   │   ├── community-card-area.svg
│   │   ├── vs-divider.svg
│   │   ├── comparison-table-template.svg
│   │   └── pro-con-boxes.svg
│   ├── decorative/
│   │   └── dealer-button.svg
│   └── visualizations/
│       ├── hand-strength-bar.svg
│       ├── range-grid-empty.svg
│       ├── position-diagram.svg
│       └── gto-exploit-icon.svg
├── cards/
│   ├── AS.svg ... KC.svg (52 cards)
│   └── back.svg
├── hand-rankings.svg
├── poker-table.svg
└── card-suits-icon.svg
```

---

## Best Practices

1. **Consistent Sizing:** Maintain aspect ratios when resizing elements
2. **Layering:** Use CSS `position: relative/absolute` for overlaying elements
3. **Color Harmony:** Elements use consistent color scheme (red=negative, green=positive, blue=neutral, yellow=warning)
4. **White Space:** Give elements breathing room for clarity
5. **Accessibility:** Add alt text describing each element's purpose
6. **Performance:** SVGs are lightweight and scale infinitely without quality loss

---

## Quick Reference: Where to Use Each Element

| Presentation Section | Recommended Elements |
|---------------------|---------------------|
| 게임 소개 (Introduction) | Poker Table, Card Suits Icon, Dealer Button |
| 기본 규칙 (Basic Rules) | Playing Cards, Community Card Area, Player Seat |
| 액션 (Actions) | Action Badges (Fold/Call/Raise), Thinking Bubble |
| 베팅 라운드 (Betting Rounds) | Community Card Area, Betting Arrow, Chip Stack |
| 포지션 (Position) | Position Diagram, Dealer Button, Warning Icon |
| 시작 핸드 (Starting Hands) | Hand Rankings Chart, Range Grid, Checkmark/X-Mark |
| 팟 오즈 (Pot Odds) | Pot Icon, Odds Ratio, Percentage Badge, EV Indicator |
| 전략 비교 (Strategy) | GTO-Exploit Icons, Comparison Table, Pro-Con Boxes, VS Divider |
| 의사결정 (Decision Making) | Thinking Bubble, Hand Strength Bar, Action Badges, Checkmark/X-Mark |
| 실전 예시 (Examples) | All elements combined creatively |

---

## Notes

- All SVG files include drop shadow filters for depth
- Color scheme is consistent across all elements
- Elements are designed to work on both light and dark backgrounds
- Text in SVGs uses Arial font for consistency
- File sizes are optimized (most under 5KB)

---

**Created:** 2025-11-20
**Total Elements:** 25 reusable components + 56 card files + 3 full illustrations
**Format:** SVG (Scalable Vector Graphics)
