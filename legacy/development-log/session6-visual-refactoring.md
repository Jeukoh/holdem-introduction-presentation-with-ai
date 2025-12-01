# Session 6: Visual Refactoring & Issue Management

**Date**: 2025-11-21
**Duration**: ~2 hours
**Focus**: Act 2 시각적 리팩토링 + Act 3/4/5 개선 사항 이슈화

---

## 📊 Context

### 시작 상황
- Act 2 slides가 Session 1에서 콘텐츠 추가되며 "스크립트 덩어리"로 변질
- 텍스트 중심 설명으로 Steve Jobs 스타일에서 이탈
- 족보(hand rankings) 슬라이드의 progressive icon animation 패턴 존재

### 사용자 피드백
> "지금 또 pt가 스티브잡스 + 아이콘들의 애니메이션으로 잘 시각화 한 구조에서 스크립트 덩어리가 되어가고 있어."

> "아까 그 족보 설명처럼, 게임을 설명할 때 진행 추이대로 아이콘들을 잘 활용해서 시각화를 최대한 활용하면 좋을 것 같아."

**핵심**: "PT를 만드는 사람들에게 강요할 수 있게" - 재사용 가능한 시각화 패턴 확립

---

## 🎯 Pattern 1: Progressive Icon Animation

### ❌ Before: Text-Heavy Slides
```html
<section>
  <h3>Texas Hold'em이란?</h3>
  <p>7장 중 5장으로 최고의 족보를 만드는 게임</p>
  <p>플레이어 vs 플레이어 대결</p>
  <p>카지노는 수수료만 가져감</p>
  <p>실력이 통합니다</p>
</section>
```
- 4개 문단 텍스트
- 시각적 임팩트 부족
- "스크립트 읽기" 형태

### ✅ After: Icon-Based Progressive Reveal
```html
<!-- Slide 1 -->
<section>
    <p style="font-size: 8em; margin: 0;">🃏</p>
    <h2 style="font-size: 3em;">7장 → 5장</h2>
    <p class="fragment" style="font-size: 1.5em;">최고의 족보를 만들어라</p>
</section>

<!-- Slide 2 -->
<section>
    <p style="font-size: 8em; margin: 0;">👥</p>
    <h2 style="font-size: 3em;">플레이어 vs 플레이어</h2>
    <p class="fragment emphasize" style="font-size: 1.8em;">실력이 통한다</p>
</section>
```

**변화**:
- 1 slide → 2 slides (한 슬라이드 = 한 메시지)
- 8em 아이콘 중심
- Fragment로 메시지 순차 reveal
- 텍스트 최소화

**결과**: Steve Jobs 스타일 회복

---

## 🎯 Pattern 2: Progressive Card Stacking Animation

### 문제: 게임 흐름 설명
5단계 (Pre-Flop → Flop → Turn → River → Showdown)를 어떻게 시각화?

### ❌ Before: Static Text Boxes
```html
<div class="two-column">
  <div>
    <h4>1. Pre-Flop</h4>
    <p>각자 2장 받음</p>
  </div>
  <div>
    <h4>2. Flop</h4>
    <p>공용 카드 3장</p>
  </div>
  <!-- ... -->
</div>
```
- 5단계가 한 번에 표시
- 정적, 순서 불명확

### ✅ After: Progressive Stacking with Icons
```html
<section>
    <h2>게임 흐름</h2>

    <!-- Pre-Flop: Fragment 0 -->
    <div class="fragment" data-fragment-index="0">
        <h3>1️⃣</h3>
        <span class="progressive-icon">🂠</span>
        <span class="progressive-icon">🂠</span>
        <p>Pre-Flop</p>
    </div>

    <!-- Flop: Fragment 1 -->
    <div class="fragment" data-fragment-index="1">
        <h3>2️⃣</h3>
        <span>+</span>
        <span class="progressive-icon">🃏</span>
        <span class="progressive-icon">🃏</span>
        <span class="progressive-icon">🃏</span>
        <p>Flop</p>
    </div>

    <!-- Turn, River, Showdown... -->
</section>
```

**CSS Pattern**:
```css
.progressive-icon {
  opacity: 0.25;
  filter: grayscale(80%);
  transform: scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.progressive-icon.current-fragment,
.fragment.progressive-icon.current-fragment {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

**효과**:
- 이전 단계: 흐릿하게 (opacity 0.25, grayscale)
- 현재 단계: 밝고 크게 (opacity 1, scale 1.05)
- 실제 게임 진행 흐름을 애니메이션으로 표현

---

## 🎯 Pattern 3: Reusable CSS Class Enforcement

### 문제: 시각화 일관성 유지
- 각 슬라이드마다 인라인 스타일 → 불일치 발생
- 다른 세션/개발자가 만들 때 "강요"할 방법 필요

### 해결책: `.progressive-icon` Class
```css
/* css/custom.css에 추가 */
.progressive-icon {
  opacity: 0.25;
  filter: grayscale(80%);
  transform: scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.progressive-icon.current-fragment {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

**사용 예시**:
```html
<!-- 어디서나 동일한 애니메이션 -->
<span class="progressive-icon">🃏</span>
<div class="fragment progressive-icon">
  <p>내용</p>
</div>
```

**장점**:
1. 재사용 가능: 모든 슬라이드에 적용
2. 일관성: 같은 애니메이션 효과
3. 유지보수: CSS 한 곳만 수정
4. "강요": Class만 추가하면 자동 적용

**결과**: "PT를 만드는 사람들에게 강요할 수 있는" 패턴 확립

---

## 🎯 Pattern 4: Parallel Session Coordination

### 상황
- **이 세션 (Session 6)**: Act 2 시각적 리팩토링
- **다른 세션**: 포커 테이블 다이어그램 CSS 템플릿 작업

### 문제: 충돌 방지
- 같은 파일 동시 수정 → Git conflict
- 중복 작업 → 시간 낭비

### 해결 전략
1. **독립적인 작업 선택**
   - Act 2 시각적 리팩토링 (완료)
   - Act 3/4/5 개선 사항 **이슈화** (코드 작성 안 함)
   - Development log 작성

2. **GitHub Issues로 작업 Queue 관리**
   - 16개 이슈 생성 (#12-27)
   - 다른 세션이 CSS 템플릿 완료 후 pick 가능
   - Priority 구분 (High/Medium/Low)

3. **SESSION-STATE.md 활용**
   - 현재 작업 중인 세션 확인
   - Lock 정보 체크
   - Task Queue 확인

**교훈**:
- **파일 기반 Lock** (SESSION-STATE.md)보다 **GitHub Issues**가 더 유연
- 코드 작성 전에 이슈로 명세화 → 다른 세션과 조율 용이

---

## 📋 Pattern 5: Issue-Driven Development

### Before: 직접 구현
```
개선점 발견 → 바로 코드 작성 → Commit
```
- 다른 세션과 충돌 가능
- 우선순위 불명확
- 작업 범위 불명확

### After: Issue-First Approach
```
개선점 발견 → GitHub Issue 생성 → 우선순위 설정 → Pick → 구현
```

### Session 6에서 생성한 16개 이슈

#### High Priority (8개) - 핵심 시각화
1. **#12**: [Act3] Pot Odds 계산 시각화
2. **#13**: [Act3] EV 공식 시각화 - Formula Builder 패턴
3. **#14**: [Act3] GTO vs Exploit 비교 다이어그램
4. **#15**: [Act4] 홀짝 vs 섯다 vs 홀덤 3-way 비교
5. **#16**: [Act4] 비교표 시각적 개선
6. **#17**: [Act4] +EV vs +V 개념 시각화
7. **#18**: [Act5] CTA 디자인 강화
8. **#19**: [Act5] "함께 할 수 있는 것들" 카드화

#### Medium Priority (6개) - 심화 표현
9. **#20**: [Act3] 멀티테이블링 화면 구성
10. **#21**: [Act3] 뱅크롤 분산 시각화
11. **#22**: [Act3] Range Analysis 차트
12. **#23**: [Act4] 웹툰 인용 시각적 강조
13. **#24**: [Act4] "세상은 불공평하다" 스토리텔링
14. **#25**: [Act5] "시작하는 방법" 정보 밀도 개선

#### Low Priority (2개) - 섬세한 개선
15. **#26**: [Act3/4] 섹션 간 시각적 연결성
16. **#27**: [Act5] Final Slide 임팩트

**이슈 작성 형식**:
```markdown
## 현재 상태
- 파일 위치, 라인 번호
- 문제점

## 개선 방향
- 구체적 시각화 방법
- 재사용 가능 패턴

## 구현 방법
- CSS class 활용
- Fragment 애니메이션

## 우선순위
High/Medium/Low + 이유
```

**장점**:
- 다른 개발자/세션이 pick 가능
- 작업 범위 명확
- 우선순위 투명
- Milestone 관리 용이

---

## 🔧 Technical Decisions

### 1. CSS 변수 활용 안 함 → 인라인 스타일
**이유**:
- Act 2 슬라이드는 일회성 메시지
- CSS class (`.progressive-icon`)는 재사용 패턴에만 적용
- 인라인 스타일로 빠른 프로토타입

**Trade-off**:
- 유지보수성 ↓
- 속도 ↑

**결론**: 프로토타입 단계에서는 속도 우선

### 2. Fragment Index 명시
```html
<div class="fragment" data-fragment-index="0">
<div class="fragment" data-fragment-index="1">
```

**이유**:
- 명시적 순서 제어
- 복잡한 애니메이션에서 순서 보장

**대안**: Fragment index 생략 (Reveal.js 자동 순서)
- 간단한 슬라이드는 생략 가능
- 복잡한 슬라이드는 명시 권장

### 3. Steve Jobs 원칙 적용
- **One slide = One message**: 슬라이드 분할 (1 → 2)
- **Big icons**: 8em 크기
- **Minimal text**: 한 줄 메시지
- **Progressive reveal**: Fragment 활용

---

## 📈 Results

### 정량적 성과
- **Act 2 슬라이드 개선**: 3개 섹션 리팩토링
  - "Texas Hold'em이란?": 1 → 2 slides
  - "게임 흐름": 5-stage progressive animation
  - "플레이어의 선택": 3 large icons
- **GitHub Issues**: 16개 생성 (High: 8, Medium: 6, Low: 2)
- **재사용 가능 CSS Pattern**: `.progressive-icon` class 확립
- **Development Log**: 이 문서 작성

### 정성적 성과
- **시각적 일관성**: 족보 슬라이드와 동일한 애니메이션 패턴
- **"강요 가능한" 템플릿**: Class 기반 재사용
- **병렬 작업 조율**: 다른 세션과 충돌 없음
- **Issue-Driven**: 구현 전 명세화

---

## 🧠 Lessons Learned

### 1. "강요할 수 있는 디자인"의 힘
**문제**: 각 슬라이드마다 다른 스타일 → 불일치
**해결**: `.progressive-icon` class → 자동 일관성

**교훈**:
> 좋은 디자인 시스템은 "올바른 선택"을 쉽게 만든다.

### 2. Issue-First Approach
**Before**: 생각 → 즉시 구현 → 충돌
**After**: 생각 → Issue → 조율 → 구현

**장점**:
- 병렬 작업 가능
- 우선순위 투명
- 작업 범위 명확

### 3. Progressive Animation의 스토리텔링 효과
**단순 나열**:
```
Pre-Flop, Flop, Turn, River, Showdown (한 번에 표시)
```

**Progressive Animation**:
```
Pre-Flop → (+Flop) → (+Turn) → (+River) → Showdown
```

**효과**:
- 실제 게임 진행과 동일한 흐름
- 청중이 단계별로 이해
- 기억에 남음

**교훈**:
> 애니메이션은 장식이 아니라 스토리텔링 도구다.

### 4. 텍스트 vs 아이콘의 Trade-off
**텍스트 많음**:
- 정보 전달 ↑
- 시각적 임팩트 ↓
- 발표자가 스크립트 읽는 느낌

**아이콘 중심**:
- 시각적 임팩트 ↑
- 정보 밀도 ↓
- 발표자가 설명을 추가해야 함

**균형점**:
- 아이콘 8em + 한 줄 메시지
- Fragment로 추가 설명 (필요 시)

---

## 🚀 Next Steps

### Immediate (다음 세션)
1. **Act 2 Synchronization**
   - Session 1의 콘텐츠 + Session 6의 시각화 → `sections/act2.html`
   - Git merge 필요

2. **High Priority Issues 구현**
   - #12-19 중 우선순위 높은 것부터
   - 다른 세션의 CSS 템플릿 활용

### Medium-term
3. **Visual QA**
   - 모든 슬라이드 브라우저 테스트
   - 애니메이션 타이밍 조정

4. **Development Log 보강**
   - Session 5 방법론 추가 (Quick Wins 패턴)
   - 다른 세션들의 패턴 정리

### Long-term
5. **Design System 문서화**
   - `.progressive-icon` 외 재사용 패턴들
   - Component library 구축 검토

---

## 📚 Reusable Patterns Summary

### Pattern 1: Progressive Icon Animation
```css
.progressive-icon {
  opacity: 0.25;
  filter: grayscale(80%);
  transform: scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.progressive-icon.current-fragment {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

**사용 시기**: 순차적 reveal이 필요한 모든 요소

### Pattern 2: One Message Per Slide
- 한 슬라이드 = 한 핵심 메시지
- 8em 아이콘 + 3em 제목 + 1.5em 설명
- Fragment로 추가 정보

**사용 시기**: Steve Jobs 스타일 발표

### Pattern 3: Issue-Driven Development
1. 개선점 발견
2. GitHub Issue 생성 (현재 상태, 개선 방향, 구현 방법, 우선순위)
3. Label + Priority
4. Pick → 구현

**사용 시기**: 병렬 작업 환경

---

## 💡 Key Takeaways

1. **시각화는 장식이 아니라 스토리텔링**
   - Progressive animation으로 게임 흐름 표현
   - 단순 나열 → 순차적 이해

2. **재사용 가능한 패턴 확립이 핵심**
   - `.progressive-icon` class
   - 다른 개발자/세션이 "올바르게" 사용하도록 강요

3. **병렬 작업은 Issue로 조율**
   - 코드 작성 전 Issue 생성
   - 충돌 방지 + 우선순위 투명

4. **One slide = One message**
   - Steve Jobs 원칙
   - 텍스트 최소화, 아이콘 극대화

---

**Last updated**: 2025-11-21
**Session**: 6
**Contributors**: Claude (Session 6)
**Files modified**:
- `sections/act2.html` (visual refactoring)
- `css/custom.css` (`.progressive-icon` pattern)
- 16 GitHub Issues created

**Total time**: ~2 hours
- Act 2 refactoring: 1 hour
- GitHub Issues: 30 min
- Development log: 30 min
