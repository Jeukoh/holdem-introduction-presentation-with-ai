# Texas Hold'em 입문 발표 - 콘텐츠 아웃라인

> **목표**: 홀덤을 처음 접하는 동료들에게 게임의 매력과 기본 규칙을 전달
> **시간**: 20-25분
> **형식**: Reveal.js + React 홀덤 엔진

---

## Part 1: 시작 (3분)

### 1.1 Hook - 왜 홀덤인가?
- [x] 타이틀 슬라이드
- [x] "인생은 홀덤과 같다" 비유
- [x] 발표 목표 소개

**구현 상태**: ✅ 완료 (`slides/part1-hook.html`)

---

## Part 2: 게임 이해하기 (12-15분)

### 2.1 카드와 족보 (3분)
- [x] 52장 덱 구성 (4 suits × 13 ranks)
- [x] 핸드 랭킹 (하이카드 → 로열플러시)
- [ ] 족보 퀴즈 (인터랙티브)

**구현 상태**: 🔶 부분 완료 (`slides/part2-basics.html`)

### 2.2 게임 진행 흐름 (8-10분)
- [x] 홀덤 엔진 통합
- [x] 프리플랍 → 플랍 → 턴 → 리버 시각화
- [ ] 베팅 라운드별 설명 강화
- [ ] 포지션 (BTN, SB, BB) 상세 설명

**구현 상태**: 🔶 부분 완료 (`slides/part2-gameplay.html`)

### 2.3 플레이어 액션 (추가 필요)
- [ ] Fold / Check / Call / Raise / All-in 설명
- [ ] 각 액션의 의미와 전략적 상황

**구현 상태**: ❌ 미구현

---

## Part 3: 마무리 (5분)

### 3.1 핵심 요약
- [ ] 게임 흐름 한눈에 보기
- [ ] 초보자가 기억할 3가지

### 3.2 다음 단계
- [ ] 연습 방법 안내
- [ ] 소모임/스터디 초대

**구현 상태**: ❌ 미구현

---

## 구현 우선순위

### Phase 1: 핵심 콘텐츠 (필수)
1. Part 2.1 족보 퀴즈 추가
2. Part 2.2 베팅 라운드 설명 보강
3. Part 2.3 플레이어 액션 슬라이드

### Phase 2: 완성도 향상 (권장)
4. Part 3 요약 및 마무리 슬라이드
5. 홀덤 엔진에 추가 시나리오 (A♠K♠ 핸드 등)

### Phase 3: 고급 기능 (선택)
6. 인터랙티브 퀴즈 기능
7. 모바일 대응

---

## 기술 스택

| 컴포넌트 | 기술 | 상태 |
|---------|------|------|
| 발표 프레임워크 | Reveal.js 4.5 | ✅ |
| 게임 엔진 | React + Framer Motion | ✅ |
| 카드 에셋 | SVG (legacy에서 추출) | ✅ |
| 빌드 | Vite (IIFE/UMD/ES) | ✅ |

---

## 파일 구조

```
holdem-introduction-presentation-with-ai/
├── index.html                 # 메인 발표 파일
├── outline.md                 # 이 문서
├── css/
│   └── presentation.css       # 커스텀 스타일
├── slides/
│   ├── part1-hook.html        # Part 1 슬라이드
│   ├── part2-basics.html      # Part 2.1 슬라이드
│   └── part2-gameplay.html    # Part 2.2 슬라이드 (홀덤 엔진)
├── prototypes/react-framer/   # 홀덤 엔진 소스
│   ├── dist/                  # 빌드 결과물
│   └── src/                   # React 컴포넌트
└── legacy/                    # 참고용 (직접 사용 X)
```

---

## 변경 이력

- 2025-12-02: 초기 아웃라인 작성 (legacy/outline.md 기반 간소화)
