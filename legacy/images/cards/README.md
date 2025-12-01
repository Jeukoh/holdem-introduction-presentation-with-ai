# 포커 카드 SVG 세트

총 53개의 SVG 카드 파일 (52장 + 뒷면 1장)

## 파일 명명 규칙

### 52장의 카드
- **Spades (스페이드 ♠)**: AS.svg, 2S.svg, 3S.svg, ..., KS.svg
- **Hearts (하트 ♥)**: AH.svg, 2H.svg, 3H.svg, ..., KH.svg
- **Diamonds (다이아몬드 ♦)**: AD.svg, 2D.svg, 3D.svg, ..., KD.svg
- **Clubs (클로버 ♣)**: AC.svg, 2C.svg, 3C.svg, ..., KC.svg

### 카드 뒷면
- **back.svg**: 카드 뒷면 디자인

## 카드 사이즈
- **크기**: 120 x 168 픽셀
- **비율**: 표준 포커 카드 비율 (약 5:7)
- **형식**: SVG (벡터 이미지, 무한 확대 가능)

## 색상
- **검정색 (Spades, Clubs)**: #000000
- **빨간색 (Hearts, Diamonds)**: #E74C3C
- **카드 배경**: #FFFFFF
- **테두리**: #CCCCCC

## HTML에서 사용 예시

```html
<!-- 에이스 스페이드 -->
<img src="images/cards/AS.svg" alt="Ace of Spades" width="120" height="168">

<!-- 킹 하트 -->
<img src="images/cards/KH.svg" alt="King of Hearts" width="120" height="168">

<!-- 카드 뒷면 -->
<img src="images/cards/back.svg" alt="Card Back" width="120" height="168">
```

## CSS로 크기 조정

```css
.poker-card {
  width: 80px;  /* 원하는 크기로 조정 */
  height: auto; /* 비율 유지 */
}
```

## 전체 카드 목록

### Spades (♠)
AS, 2S, 3S, 4S, 5S, 6S, 7S, 8S, 9S, 10S, JS, QS, KS

### Hearts (♥)
AH, 2H, 3H, 4H, 5H, 6H, 7H, 8H, 9H, 10H, JH, QH, KH

### Diamonds (♦)
AD, 2D, 3D, 4D, 5D, 6D, 7D, 8D, 9D, 10D, JD, QD, KD

### Clubs (♣)
AC, 2C, 3C, 4C, 5C, 6C, 7C, 8C, 9C, 10C, JC, QC, KC

---

생성 스크립트: `scripts/generate-cards.js`
