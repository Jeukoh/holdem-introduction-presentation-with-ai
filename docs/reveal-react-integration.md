# Reveal.js + React 홀덤 엔진 통합 가이드

> 발표 제작자를 위한 통합 전략 및 사용법

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────┐
│                 Reveal.js (발표 레이어)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 슬라이드 1   │  │ 슬라이드 2   │  │ 슬라이드 3   │   │
│  │ (텍스트)     │  │ (iframe)    │  │ (설명+게임)  │   │
│  └─────────────┘  └──────┬──────┘  └─────────────┘   │
└──────────────────────────┼──────────────────────────┘
                           │ URL 파라미터 / postMessage
                           ▼
┌─────────────────────────────────────────────────────┐
│              React 홀덤 엔진 (게임 레이어)            │
│  - 순수 게임 시뮬레이션 (발표 로직 없음)              │
│  - PHH 파싱 → 상태 관리 → 렌더링                    │
│  - API: URL params, postMessage                     │
└─────────────────────────────────────────────────────┘
```

### 핵심 원칙: 관심사 분리

| 계층 | 책임 | 파일 |
|-----|------|-----|
| **Reveal.js** | 슬라이드 흐름, 설명 텍스트, 전환 효과 | `*.html` |
| **React 엔진** | 게임 상태, 애니메이션, 카드/칩 렌더링 | `prototypes/react-framer/` |

---

## React 엔진 API

### 1. URL 파라미터 (정적 제어)

```
http://localhost:5173/?scenario=preflop&step=2&embed=true
```

| 파라미터 | 설명 | 예시 |
|---------|------|-----|
| `scenario` | 시나리오 키 | `preflop`, `flop`, `tutorial`, `phh` |
| `step` | 시작 스텝 (0부터) | `0`, `1`, `2`, ... |
| `embed` | 임베드 모드 (컨트롤 숨김) | `true` |

### 2. postMessage API (동적 제어)

```javascript
// Reveal.js에서 React 엔진 제어
const iframe = document.getElementById('holdem-frame');

// 특정 스텝으로 이동
iframe.contentWindow.postMessage({
    type: 'holdem-control',
    action: 'goto',
    step: 3
}, '*');

// 다음 스텝
iframe.contentWindow.postMessage({
    type: 'holdem-control',
    action: 'next'
}, '*');

// 리셋
iframe.contentWindow.postMessage({
    type: 'holdem-control',
    action: 'reset'
}, '*');
```

### 3. 사용 가능한 시나리오

| 시나리오 | 설명 | 스텝 수 |
|---------|------|--------|
| `preflop` | Pre-flop 기본 액션 | 6 |
| `flop` | 플랍 의사결정 | 4 |
| `tutorial` | 한 판 전체 흐름 | 12 |
| `phh` | PHH 파일에서 파싱된 핸드 | 가변 |

---

## Reveal.js 슬라이드 작성법

### 기본 패턴: 게임만 보여주기

```html
<section>
    <h2>Pre-flop 시작</h2>
    <iframe
        class="holdem-frame"
        src="http://localhost:5173/?scenario=preflop&step=1&embed=true"
    ></iframe>
</section>
```

### 고급 패턴: 게임 + 설명 패널

```html
<section>
    <div class="slide-with-explanation">
        <iframe
            class="holdem-frame"
            style="width: 800px; height: 600px;"
            src="http://localhost:5173/?scenario=preflop&step=4&embed=true"
        ></iframe>
        <div class="explanation-panel">
            <h3>UTG가 폴드</h3>
            <p>UTG는 가장 먼저 액션해야 하는 불리한 포지션입니다.</p>
        </div>
    </div>
</section>
```

### 동적 제어: 슬라이드 전환 시 게임 조작

```javascript
Reveal.on('slidechanged', event => {
    // 특정 슬라이드에서 게임 스텝 변경
    if (event.indexh === 3) {
        sendToHoldem('holdem-frame', 'goto', { step: 5 });
    }
});
```

---

## 발표 제작 워크플로우

### Step 1: 시나리오 설계

1. **발표 목표 정의**: "Pre-flop 액션 순서 이해"
2. **필요한 게임 상태 나열**:
   - 테이블 셋업 (step 0)
   - 카드 딜링 (step 1)
   - 블라인드 (step 2)
   - UTG 폴드 (step 3)
   - ...

### Step 2: 슬라이드 구성

```
슬라이드 1: 제목 (텍스트만)
슬라이드 2: 테이블 소개 (게임 step=1)
슬라이드 3: 카드 딜링 설명 (게임 step=2 + 설명 패널)
슬라이드 4: 포지션별 액션 (게임 step=3~5)
슬라이드 5: 요약 (텍스트만)
```

### Step 3: 커스텀 시나리오 추가 (선택)

`prototypes/react-framer/src/App.jsx`의 `scenarios` 객체에 추가:

```javascript
const scenarios = {
    // 기존 시나리오...

    myCustomScenario: {
        name: '나의 시나리오',
        yourPosition: 'BTN',
        yourCards: [
            { suit: '♠', rank: 'A', color: 'black' },
            { suit: '♠', rank: 'K', color: 'black' }
        ],
        steps: [
            { type: 'setup', description: '셋업' },
            { type: 'deal', description: '딜링' },
            // ...
        ]
    }
};
```

---

## CSS 스타일 가이드

### 필수 스타일

```css
/* iframe 컨테이너 */
.holdem-frame {
    width: 100%;
    height: 700px;
    border: none;
    border-radius: 16px;
    background: #0a0a0a;
}

/* 게임 + 설명 레이아웃 */
.slide-with-explanation {
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: center;
}

/* 설명 패널 */
.explanation-panel {
    width: 300px;
    text-align: left;
    padding: 30px;
    background: rgba(52, 73, 94, 0.5);
    border-radius: 16px;
    border-left: 4px solid var(--gold);
}
```

---

## 트러블슈팅

### iframe 키보드 충돌

**문제**: 화살표 키가 Reveal.js와 React 엔진 모두에 반응

**해결**: embed 모드에서는 React 엔진의 키보드 이벤트 비활성화됨

### iframe 로딩 지연

**문제**: 슬라이드 전환 시 게임이 늦게 로드됨

**해결**:
1. `data-preload` 속성 사용
2. 또는 모든 iframe을 미리 로드

```html
<section data-preload>
    <iframe src="..."></iframe>
</section>
```

---

## 다음 단계

- [ ] PHH 파일 임포트 기능
- [ ] 실시간 Pot Odds 계산기 연동
- [ ] 손 강도 시각화 추가
