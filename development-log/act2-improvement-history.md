# Act 2 개선 가이드 (Session 1용)

> **작성**: Session 2 (독립적 리뷰)
> **대상**: Session 1 (Act 2 개선 담당)
> **목적**: index.html Act 2 부분을 outline.md 의도에 맞게 개선

**작업 완료 후**: 이 파일을 `development-log/act2-improvement-history.md`로 이동하고, 실제 적용 내용 및 배운 점 추가

---

## 📋 빠른 참조

### 현재 상태 요약

**✅ 잘된 것**:
- 52장 카드 덱 그리드 시각화 (Royal Flush, Flush, One Pair)
- Fragment 애니메이션으로 조합 수 표시
- A♠K♠ 예시를 통한 팟 오즈 계산
- 직관 vs 수학 대비

**⚠️ 개선 필요**:
- **순서 문제**: 게임 룰 설명 전에 족보부터 시작
- **2-1 내용 대부분 누락**: 게임 흐름, 플레이어 선택, 하우스와의 차이
- **2-3 시뮬레이션 압축**: 한 슬라이드에 모든 단계, 의사결정 과정 부족
- **Act 3 연결 없음**: "다음 단계" 예고 부재

### 권장 작업 순서

**Priority 1 (필수)**: 게임 이해를 위한 기초
1. 게임 흐름 슬라이드 추가 (프리플랍/플랍/턴/리버)
2. 플레이어 선택 설명 (폴드/콜/레이즈)
3. 홀덤 특징 강화 (하우스와 싸우지 않음)

**Priority 2 (필수)**: 시뮬레이션 확장
4. 게임 시뮬레이션을 여러 슬라이드로 분리
5. 아웃츠 개념 설명 추가
6. 각 단계별 의사결정 과정 명시

**Priority 3 (권장)**: 연결 강화
7. 족보 실전 빈도 언급
8. Act 3 예고 슬라이드

---

## 📊 현재 구현 상태

### Act 2 슬라이드 목록 (10개)

| # | Line | 제목 | 내용 |
|---|------|------|------|
| 1 | 88-96 | 포커 족보 | Cheat sheet 이미지 |
| 2 | 99-123 | 1. 로열 플러시 | 52장 덱, 4가지 조합 |
| 3 | 126-150 | 5. 플러시 | 5,108가지 조합 |
| 4 | 153-178 | 9. 원 페어 | 1,098,240가지 조합 |
| 5 | 181-191 | Texas Hold'em 특징 | 7장 중 5장 선택 |
| 6 | 194-228 | 홀덤 테이블 | 포지션 설명 |
| 7 | 231-255 | 게임 시뮬레이션 | A♠K♠ 예시 (한 슬라이드) |
| 8 | 258-274 | 수학적 사고 | 48% 승률, 팟오즈 |
| 9 | 277-298 | 직관 vs 수학 | 초보자 vs 프로 |
| 10 | 301-313 | 핵심 | 수학이 직관 검증 |

---

## 🎯 Outline 의도 vs 현재 구현

### 2-1. 홀덤의 기본 구조

**Outline 의도** (outline.md:38-60):
```
**카드 배분**:
- 홀 카드 2장 (개인)
- 커뮤니티 카드 5장 (공용)
- 목표: 7장 중 최고의 5장 조합

**게임 흐름**:
1. 프리플랍 - 홀 카드 받고 첫 베팅
2. 플랍 - 공용 카드 3장 공개, 베팅
3. 턴 - 공용 카드 1장 추가, 베팅
4. 리버 - 마지막 공용 카드, 최종 베팅
5. 쇼다운 - 카드 공개, 승자 결정

**플레이어의 선택**:
- 폴드: 포기
- 콜: 따라가기
- 레이즈: 올리기

**핵심 차이점**:
- 플레이어 vs 플레이어 (하우스와 싸우지 않음)
- 바카라, 룰렛과의 근본적 차이
```

**현재 상태**:
- ✅ 카드 배분: "Texas Hold'em Specifics" 슬라이드에 언급 (index.html:181-191)
- ⚠️ 게임 흐름: "Poker Table Diagram"에 포지션만 (index.html:194-228)
- ❌ 플레이어 선택: 설명 없음
- ❌ 핵심 차이점: 언급 없음

**갭 분석**:
- 게임 흐름 5단계 상세 설명 **누락**
- 폴드/콜/레이즈 개념 **누락**
- 하우스와의 차이 **누락**

---

### 2-2. 족보 (핸드 랭킹)

**Outline 의도** (outline.md:63-82):
```
**10단계** (강한 순):
1-10. [전체 목록]

**실전 빈도**:
- 상위 5개: 좋은 패, 드물게 나옴
- 하위 5개: 대부분의 판은 이것으로 결판
- 원페어와 투페어가 가장 흔함
```

**현재 상태**:
- ✅ 족보 표: Cheat sheet 이미지 (index.html:88-96)
- ✅ 3개 상세: Royal Flush, Flush, One Pair (시각화 훌륭)
- ⚠️ 나머지 7개: 이미지로만, 설명 없음
- ❌ 실전 빈도: 언급 없음

**갭 분석**:
- 실전 빈도 설명 **누락** ("원페어가 가장 흔함" 등)
- 3개는 과도하게 상세, 7개는 생략 (균형 개선 필요)

---

### 2-3. 실제 게임 시뮬레이션

**Outline 의도** (outline.md:85-103):
```
**시나리오**: A♠ K♠를 들고 한 판 따라가기

**프리플랍 → 플랍 → 턴 → 리버**:
- 각 단계의 의사결정
- 직관적 판단 vs 수학적 분석
- 아웃츠, 팟 오즈, Range 분석

**핵심 깨달음**:
- 주어진 정보로 확률 계산
- 수학적 근거로 의사결정
- 직관이 수학으로 모델링됨

**다음 단계로**:
- 기본 계산은 시작일 뿐
- 메타데이터의 세계 (Implied Odds, ICM, Range)
- 3부에서 상세히
```

**현재 상태**:
- ✅ A♠K♠ 예시: 있음 (index.html:231-255)
- ⚠️ 한 슬라이드에 압축: 프리플랍~리버 모두
- ❌ 각 단계 의사결정: Fragment로 카드만 나옴
- ❌ 아웃츠 개념: 설명 없음 (12개 아웃츠가 왜 48%?)
- ❌ Range 분석: 언급 없음
- ❌ 다음 단계 예고: 없음

**현재 notes (index.html:247-254)**:
```
플랍에 Q♠ J♠ 3♣가 나왔습니다. 지금은 아무것도 없지만,
스페이드가 하나만 더 나오면 플러시, 10이 나오면 스트레이트입니다.
턴에 10♠이 나왔습니다. 스트레이트이면서 플러시! ...
```
→ 좋지만, **의사결정이 없음** ("상대가 베팅했다, 나는?" 같은 게 없음)

**갭 분석**:
- 각 라운드별 베팅 상황 **누락**
- 아웃츠 개념 **누락**
- 의사결정 과정 **누락**
- Act 3 연결 **누락**

---

## 🔧 구체적 개선 방안

### Option A: 대공사 (Outline 따라 재구성) ⭐ 추천

**이유**: Outline 의도를 정확히 구현, 교육 효과 극대화

**변경 사항**:
1. **순서 재배치**: 기본 구조 → 족보 → 시뮬레이션
2. **누락 내용 추가**: 게임 흐름, 플레이어 선택, 하우스와의 차이
3. **시뮬레이션 확장**: 1개 → 4-5개 슬라이드
4. **연결 강화**: Act 3 예고

**예상 슬라이드 수**: 10개 → 18-20개
**예상 작업 시간**: 2-3시간
**난이도**: 중

---

### Option B: 소공사 (현재 유지 + 최소 보완)

**이유**: 시간 제약, 기존 시각화 최대한 활용

**변경 사항**:
1. **Texas Hold'em Specifics 확장**: 하우스와의 차이 추가
2. **Poker Table Diagram 보강**: 게임 흐름 간단히 추가
3. **Game Simulation 분리**: 1개 → 2-3개 슬라이드
4. **Act 3 예고 추가**: 마지막에 1개 슬라이드

**예상 슬라이드 수**: 10개 → 13-15개
**예상 작업 시간**: 1-1.5시간
**난이도**: 하

---

## 📝 슬라이드별 상세 스펙 (Option A 기준)

### 신규 슬라이드 1: 홀덤이란?

**위치**: line 87 앞에 삽입

**목적**: 게임의 정체성 명확히

**내용**:
- Texas Hold'em은 포커의 한 종류
- 7장 중 5장 선택 (내 카드 2 + 공용 5)
- **핵심 차이**: 플레이어 vs 플레이어 (하우스 X)
- 바카라/룰렛: 하우스 엣지 있음
- 홀덤: 플레이어 간 경쟁, 실력 게임

**HTML 예시**:
```html
<section>
    <h2>Texas Hold'em이란?</h2>
    <p class="fragment">포커의 한 종류</p>
    <p class="fragment emphasize" style="font-size: 1.4em; margin-top: 1em;">
        7장 중 5장을 선택해<br>
        최고의 족보를 만든다
    </p>
    <p class="fragment" style="margin-top: 1em;">내 카드 2장 + 공용 카드 5장</p>

    <div class="fragment" style="margin-top: 2em; padding: 1em; background: rgba(255,255,255,0.1); border-radius: 10px;">
        <h4>🎯 핵심 차이</h4>
        <p><strong>플레이어 vs 플레이어</strong></p>
        <p style="font-size: 0.9em; margin-top: 0.5em;">
            바카라, 룰렛: 하우스와 싸움 (하우스 엣지 존재)<br>
            <span class="emphasize">홀덤: 플레이어끼리 경쟁 → 실력이 통한다</span>
        </p>
    </div>

    <aside class="notes">
        홀덤은 여러 포커 게임 중 하나입니다.
        가장 중요한 특징은 플레이어끼리 경쟁한다는 것입니다.
        바카라나 룰렛은 카지노와 싸우지만, 홀덤은 다른 플레이어와 싸웁니다.
        이것이 실력 게임이 될 수 있는 이유입니다.
    </aside>
</section>
```

---

### 신규 슬라이드 2: 게임 흐름

**위치**: 신규 슬라이드 1 뒤

**목적**: 5단계 게임 진행 이해

**내용**:
1. 프리플랍: 홀카드 2장 받고 첫 베팅
2. 플랍: 공용 카드 3장 공개, 베팅
3. 턴: 카드 1장 추가, 베팅
4. 리버: 마지막 카드, 최종 베팅
5. 쇼다운: 카드 공개, 승자 결정

**HTML 예시**:
```html
<section>
    <h2>게임 흐름</h2>
    <div class="game-flow">
        <div class="flow-step fragment">
            <h4>1. 프리플랍 (Pre-flop)</h4>
            <p>홀 카드 2장 받고 첫 베팅</p>
        </div>
        <div class="flow-step fragment">
            <h4>2. 플랍 (Flop)</h4>
            <p>공용 카드 3장 공개, 베팅</p>
        </div>
        <div class="flow-step fragment">
            <h4>3. 턴 (Turn)</h4>
            <p>공용 카드 1장 추가, 베팅</p>
        </div>
        <div class="flow-step fragment">
            <h4>4. 리버 (River)</h4>
            <p>마지막 공용 카드, 최종 베팅</p>
        </div>
        <div class="flow-step fragment">
            <h4>5. 쇼다운 (Showdown)</h4>
            <p>카드 공개, 승자 결정</p>
        </div>
    </div>
    <aside class="notes">
        홀덤은 총 5단계로 진행됩니다.
        프리플랍에서 자기 카드 2장을 받고 첫 베팅을 합니다.
        플랍에서 공용 카드 3장이 공개되고, 또 베팅합니다.
        턴과 리버에서 각각 카드 1장씩 추가되며 매번 베팅 기회가 있습니다.
        마지막 쇼다운에서 카드를 공개하고 승자가 결정됩니다.
    </aside>
</section>
```

**CSS 추가 필요** (css/custom.css):
```css
.game-flow {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-top: 2em;
}

.flow-step {
    padding: 1em;
    background: rgba(255, 255, 255, 0.1);
    border-left: 4px solid #3498db;
    border-radius: 5px;
}

.flow-step h4 {
    margin: 0 0 0.5em 0;
    color: #3498db;
}

.flow-step p {
    margin: 0;
    font-size: 0.9em;
}
```

---

### 신규 슬라이드 3: 플레이어의 선택

**위치**: 게임 흐름 슬라이드 뒤

**목적**: 폴드/콜/레이즈 개념 이해

**내용**:
- 매 베팅 라운드마다 선택
- 폴드: 포기 (더 이상 베팅 안 함)
- 콜: 따라가기 (상대와 같은 금액)
- 레이즈: 올리기 (상대보다 더 많이)

**HTML 예시**:
```html
<section>
    <h2>플레이어의 선택</h2>
    <p>매 베팅 라운드마다 세 가지 선택지</p>

    <div class="actions-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2em; margin-top: 2em;">
        <div class="action-card fragment">
            <div class="action-badge" style="background: #e74c3c; color: white; padding: 0.5em; border-radius: 5px; font-weight: bold; font-size: 1.2em;">FOLD</div>
            <p style="margin-top: 1em;">포기</p>
            <p style="font-size: 0.8em; color: #aaa;">더 이상 베팅하지 않음</p>
        </div>

        <div class="action-card fragment">
            <div class="action-badge" style="background: #3498db; color: white; padding: 0.5em; border-radius: 5px; font-weight: bold; font-size: 1.2em;">CALL</div>
            <p style="margin-top: 1em;">따라가기</p>
            <p style="font-size: 0.8em; color: #aaa;">상대와 같은 금액 베팅</p>
        </div>

        <div class="action-card fragment">
            <div class="action-badge" style="background: #27ae60; color: white; padding: 0.5em; border-radius: 5px; font-weight: bold; font-size: 1.2em;">RAISE</div>
            <p style="margin-top: 1em;">올리기</p>
            <p style="font-size: 0.8em; color: #aaa;">상대보다 더 많이 베팅</p>
        </div>
    </div>

    <aside class="notes">
        매 베팅 라운드마다 플레이어는 세 가지 선택지가 있습니다.
        폴드는 포기하는 것입니다. 패가 나빠서 더 이상 베팅하고 싶지 않을 때 선택합니다.
        콜은 상대의 베팅을 따라가는 것입니다. 같은 금액을 베팅합니다.
        레이즈는 상대보다 더 많이 베팅하는 것입니다. 내 패가 좋거나 상대를 압박하고 싶을 때 사용합니다.
    </aside>
</section>
```

---

### 수정 슬라이드: 족보 (현재 유지, 보완)

**위치**: index.html:88-96

**변경 사항**: Notes에 실전 빈도 추가

**수정 후 notes**:
```html
<aside class="notes">
    포커에는 10가지 족보가 있습니다.
    1위 로열 플러시부터 10위 하이 카드까지, 확률이 낮을수록 강한 패입니다.

    <strong>실전에서는 어떤 족보가 자주 나올까요?</strong>
    상위 5개(로열 플러시~플러시)는 매우 드뭅니다.
    하위 5개(스트레이트~하이카드), 특히 원페어와 투페어가 가장 흔합니다.
    대부분의 판은 "누가 더 높은 페어를 가졌느냐"를 다투게 됩니다.

    지금부터 각 족보가 왜 그런 순위인지, 52장의 카드 중 어떤 조합들이 가능한지 보면서 이해해보겠습니다.
</aside>
```

---

### 신규 슬라이드: 시뮬레이션 - 프리플랍

**위치**: 현재 "Game Simulation" 슬라이드 (index.html:231-255) 대체 → 여러 슬라이드로 분리

**슬라이드 1: 프리플랍 상황**

```html
<section>
    <h2>실전 시뮬레이션: 프리플랍</h2>
    <div class="poker-table">
        <div class="player-seat seat-1">
            <span class="card-large fragment">A<span class="spade">♠</span></span>
            <span class="card-large fragment">K<span class="spade">♠</span></span>
        </div>
        <div class="pot-display fragment">$10 (블라인드)</div>
    </div>

    <div class="fragment" style="margin-top: 2em;">
        <p class="emphasize">A♠ K♠ - 아주 좋은 패!</p>
        <p style="margin-top: 1em;">당신의 결정은? <span class="fragment"><strong>RAISE $30</strong></span></p>
    </div>

    <aside class="notes">
        실제 게임을 시뮬레이션해보겠습니다.
        당신은 A♠ K♠를 받았습니다. 이것은 프리플랍에서 아주 좋은 패입니다.
        블라인드 10달러가 팟에 있습니다.
        당신은 레이즈해서 30달러를 베팅합니다. 상대가 콜했습니다.
        이제 플랍을 보겠습니다.
    </aside>
</section>
```

**슬라이드 2: 플랍 상황**

```html
<section>
    <h2>실전 시뮬레이션: 플랍</h2>
    <div class="poker-table">
        <div class="player-seat seat-1">
            <span class="card-large">A<span class="spade">♠</span></span>
            <span class="card-large">K<span class="spade">♠</span></span>
        </div>
        <div class="community-cards">
            <span class="card-large fragment">Q<span class="spade">♠</span></span>
            <span class="card-large fragment">J<span class="spade">♠</span></span>
            <span class="card-large fragment">3<span class="club">♣</span></span>
            <span class="card-large card-back"></span>
            <span class="card-large card-back"></span>
        </div>
        <div class="pot-display fragment">$70</div>
    </div>

    <div class="fragment" style="margin-top: 1em; text-align: left;">
        <p><strong>현재 상황:</strong> 아직 아무것도 없음 (에이스 하이)</p>
        <p class="fragment"><strong>하지만...</strong></p>
        <ul class="fragment">
            <li>스페이드 1장만 더 나오면 → <span class="emphasize">플러시</span></li>
            <li>10이 나오면 → <span class="emphasize">스트레이트</span></li>
            <li><strong>아웃츠 (Outs)</strong>: 9장 (스페이드) + 3장 (10) = <span class="emphasize">12장</span></li>
        </ul>
        <p class="fragment" style="margin-top: 1em;">
            <strong>승률 계산:</strong> 12 아웃츠 × 4 = <span class="emphasize" style="font-size: 1.3em;">48%</span>
        </p>
    </div>

    <div class="fragment" style="margin-top: 1em; padding: 1em; background: rgba(52,152,219,0.2); border-radius: 10px;">
        <p><strong>상대가 $40 베팅</strong></p>
        <p>팟 오즈: $40 / ($70 + $40) = 36.4% 필요</p>
        <p class="emphasize">48% > 36.4% → <strong>CALL!</strong></p>
    </div>

    <aside class="notes">
        플랍에 Q♠ J♠ 3♣가 나왔습니다.
        지금 당신은 아무것도 없습니다. 에이스 하이일 뿐입니다.

        하지만 아웃츠를 계산해보겠습니다.
        스페이드가 하나만 더 나오면 플러시입니다. 남은 스페이드는 9장입니다.
        10이 나오면 스트레이트입니다. 남은 10은 3장입니다.
        총 12장의 아웃츠가 있습니다.

        Rule of 4: 플랍에서 턴+리버까지 2번 기회가 있으므로, 12 × 4 = 48% 승률입니다.

        상대가 40달러를 베팅했습니다. 팟에는 70달러가 있습니다.
        콜하려면 40달러가 필요하므로, 팟 오즈는 40 / 110 = 36.4%입니다.

        내 승률 48%는 필요 승률 36.4%보다 높습니다. 수학적으로 콜이 정답입니다.
    </aside>
</section>
```

**슬라이드 3: 턴**

```html
<section>
    <h2>실전 시뮬레이션: 턴</h2>
    <div class="poker-table">
        <div class="player-seat seat-1">
            <span class="card-large">A<span class="spade">♠</span></span>
            <span class="card-large">K<span class="spade">♠</span></span>
        </div>
        <div class="community-cards">
            <span class="card-large">Q<span class="spade">♠</span></span>
            <span class="card-large">J<span class="spade">♠</span></span>
            <span class="card-large">3<span class="club">♣</span></span>
            <span class="card-large fragment" data-fragment-index="0">10<span class="spade">♠</span></span>
            <span class="card-large card-back"></span>
        </div>
        <div class="pot-display">$145</div>
    </div>

    <div class="fragment" data-fragment-index="1" style="margin-top: 2em;">
        <h3 class="emphasize" style="color: #27ae60;">🎉 로열 스트레이트 플러시!</h3>
        <p>A-K-Q-J-10 모두 스페이드</p>
        <p style="margin-top: 1em;">가장 강한 패. <strong>이미 이겼습니다.</strong></p>
    </div>

    <aside class="notes">
        턴에 10♠이 나왔습니다!
        A♠ K♠ Q♠ J♠ 10♠ - 로열 스트레이트 플러시입니다.
        이것은 포커에서 가장 강한 패입니다.
        리버 카드가 무엇이 나오든 상관없습니다. 이미 이겼습니다.

        이것이 수학적 사고의 힘입니다.
        플랍에서 "아무것도 없다"고 포기했다면 이 판을 놓쳤을 것입니다.
        하지만 아웃츠와 팟 오즈를 계산해서 콜했고, 결과적으로 최고의 패를 만들었습니다.
    </aside>
</section>
```

---

### 신규 슬라이드: Act 3 예고

**위치**: 현재 "Key Takeaway" 슬라이드 (index.html:301-313) 뒤

**목적**: Act 2와 Act 3 자연스럽게 연결

**HTML 예시**:
```html
<section>
    <h2>이것은 시작일 뿐</h2>
    <p class="fragment">아웃츠, 팟 오즈는 <strong>기초</strong>입니다.</p>

    <div class="fragment" style="margin-top: 2em; padding: 1.5em; background: rgba(255,255,255,0.1); border-radius: 10px;">
        <h4>실전에서는 더 복잡합니다</h4>
        <ul style="text-align: left; display: inline-block; margin-top: 1em;">
            <li><strong>Implied Odds</strong>: 미래 가치까지 계산</li>
            <li><strong>Range Analysis</strong>: 상대의 가능한 모든 핸드</li>
            <li><strong>ICM</strong>: 토너먼트 칩 가치 모델</li>
            <li><strong>GTO vs Exploit</strong>: 최적 전략 vs 상대 약점 공략</li>
        </ul>
    </div>

    <p class="fragment emphasize" style="margin-top: 2em; font-size: 1.2em;">
        다음 챕터에서 계속됩니다...
    </p>

    <aside class="notes">
        지금까지 배운 것은 홀덤의 기초입니다.
        아웃츠와 팟 오즈만으로도 많은 상황을 해결할 수 있지만, 실전은 더 복잡합니다.

        Implied Odds는 현재 팟뿐 아니라 미래에 벌 수 있는 돈까지 계산합니다.
        Range Analysis는 상대가 가진 한 장의 카드가 아니라, 가능한 모든 핸드의 분포를 분석합니다.
        ICM은 토너먼트에서 칩의 가치가 실제 돈과 다르다는 것을 모델링합니다.
        GTO와 Exploit은 게임 이론 최적 전략과 상대 약점 공략 전략입니다.

        이 모든 것은 Act 3에서 자세히 다루겠습니다.
    </aside>
</section>
```

---

## ✅ 작업 체크리스트

### Phase 1: 기본 구조 보완 (필수)

- [ ] **신규 슬라이드 1**: "홀덤이란?" 추가 (line 87 앞)
  - 7장 중 5장 선택
  - 플레이어 vs 플레이어 강조
  - 하우스와의 차이 설명

- [ ] **신규 슬라이드 2**: "게임 흐름" 추가
  - 5단계 설명 (프리플랍/플랍/턴/리버/쇼다운)
  - 각 단계마다 베팅

- [ ] **신규 슬라이드 3**: "플레이어의 선택" 추가
  - 폴드/콜/레이즈 개념
  - 액션 뱃지 시각화

- [ ] **CSS 추가**: `css/custom.css`에 `.game-flow`, `.action-card` 스타일

### Phase 2: 시뮬레이션 확장 (필수)

- [ ] **기존 슬라이드 분리**: "Game Simulation" (index.html:231-255) → 3개로 분리
  - 슬라이드 1: 프리플랍 (A♠K♠ 받음, 레이즈)
  - 슬라이드 2: 플랍 (Q♠J♠3♣, 아웃츠 12개 = 48%, 팟오즈 계산, 콜)
  - 슬라이드 3: 턴 (10♠, 로열 플러시 완성)

- [ ] **아웃츠 개념 추가**: 플랍 슬라이드에 상세 설명
  - 9장 스페이드 + 3장 10
  - Rule of 4: 12 × 4 = 48%

- [ ] **의사결정 과정 명시**: 각 슬라이드마다
  - "상대가 $X 베팅"
  - "팟 오즈 계산"
  - "결정: CALL/RAISE/FOLD"

### Phase 3: 연결 개선 (권장)

- [ ] **족보 슬라이드 보강**: index.html:88-96 notes에 실전 빈도 추가
  - "원페어와 투페어가 가장 흔함"
  - "대부분의 판은 하위 5개로 결판"

- [ ] **신규 슬라이드**: "이것은 시작일 뿐" (Act 3 예고)
  - Implied Odds, Range, ICM, GTO/Exploit 언급
  - "다음 챕터에서 계속..."

### Phase 4: 검증 (필수)

- [ ] **reveal.js 테스트**: 로컬에서 index.html 열어보기
  - 모든 슬라이드 정상 렌더링
  - Fragment 순서 확인
  - Notes 내용 확인

- [ ] **순서 확인**: Act 2 전체 흐름이 자연스러운지
  - 홀덤이란 → 게임 흐름 → 플레이어 선택 → 족보 → 시뮬레이션 → 수학 → 직관vs수학 → 핵심 → Act3 예고

- [ ] **Timing 체크**: Act 2 예상 시간 8-10분 유지되는지

- [ ] **SESSION-STATE.md 업데이트**: 작업 완료 후
  - Status: Working → Completed
  - Locked Resources 해제
  - Tasks 체크

---

## ⚠️ 주의사항

### 1. 기존 시각화 보존

**유지해야 할 것**:
- Royal Flush, Flush, One Pair 52장 덱 그리드 (index.html:102-136)
- Fragment 애니메이션 (data-fragment-index)
- 조합 수 표시 (`<div class="combo-count">`)
- 현재 잘 작동하는 CSS 클래스들

**수정 금지**:
- `.deck-grid` 구조
- Fragment timing
- 카드 이미지 경로

### 2. Fragment 순서 주의

**Fragment index를 명시적으로 지정**:
```html
<span class="fragment" data-fragment-index="0">첫 번째</span>
<span class="fragment" data-fragment-index="1">두 번째</span>
```

**같은 순서로 나타나야 할 것들은 같은 index**:
```html
<span class="fragment" data-fragment-index="0">A♠</span>
<span class="fragment" data-fragment-index="0">K♠</span>
```

### 3. Notes 작성

**모든 슬라이드에 `<aside class="notes">` 필수**:
- 발표자가 실제로 말할 내용
- 자연스러운 구어체
- 슬라이드 텍스트보다 상세

**예시**:
```html
<aside class="notes">
    (실제로 말할 내용을 자연스럽게)
    플랍에 Q♠ J♠ 3♣가 나왔습니다. 지금 당신은...
</aside>
```

### 4. CSS 클래스 재사용

**이미 정의된 클래스 활용**:
- `.emphasize`: 강조 텍스트
- `.highlight-red`: 빨간색 하이라이트
- `.two-column`: 2단 레이아웃
- `.poker-table`: 테이블 레이아웃

**신규 클래스는 `css/custom.css`에 추가**

### 5. Line 번호 참고

**수정 위치**:
- Act 2 시작: line 84
- Act 2 끝: line 313
- Act 3 시작: line 316

**삽입 시**:
- 신규 슬라이드는 `<section>...</section>` 단위로
- Act 2 섹션 내부에만 추가

### 6. Git Commit

**작은 단위로 자주 커밋**:
```bash
git add index.html
git commit -m "[Session1] Act 2: Add game flow explanation"
git push

git add css/custom.css
git commit -m "[Session1] Act 2: Add CSS for game flow"
git push
```

**Commit message 형식**:
```
[Session1] Act 2: <작업 내용>
```

---

## 🎯 핵심 문제 다시 한번

**현재 Act 2의 문제**:
> "족보가 뭔지는 알겠는데... 그래서 게임은 어떻게 하는 거지?"

**목표**:
> "아, 카드 받고 → 베팅하고 → 카드 나오고 → 또 베팅하고... 그리고 아웃츠로 계산해서 콜할지 폴드할지 결정하는구나!"

**완전 초보자가 이 발표를 듣고**:
- ✅ 홀덤이 뭔지 알 수 있다
- ✅ 집에 가서 친구들과 한 판 할 수 있다
- ✅ 기본적인 의사결정(아웃츠, 팟오즈)을 이해한다

---

## 📚 참고 파일

**반드시 읽어야 할 것**:
- `outline.md`: 전체 발표 구조 및 Act 2 의도 (lines 36-103)
- `CLAUDE.md`: 프로젝트 원칙 및 작업 방법
- `SESSION-STATE.md`: 현재 작업 상태
- `SESSION-RULES.md`: 작업 규칙 및 워크플로우

**참고하면 좋은 것**:
- `images/DIAGRAM-ELEMENTS.md`: 사용 가능한 SVG 요소들
- `development-log/claude-code-presentation-methodology.md`: 작업 방법론

---

**작업 시작 전 확인 사항**:
1. [ ] `SESSION-STATE.md`에서 Session 1 status 확인
2. [ ] `outline.md` Act 2 부분 정독
3. [ ] 현재 `index.html` Act 2 부분 읽고 이해
4. [ ] 이 가이드의 체크리스트 확인

**작업 완료 후**:
1. [ ] 모든 체크리스트 완료
2. [ ] reveal.js로 테스트
3. [ ] `SESSION-STATE.md` 업데이트 (상태, Tasks, Last commit)
4. [ ] 이 파일을 `development-log/act2-improvement-history.md`로 이동
5. [ ] 실제 적용 내용 및 배운 점 추가

---

**Good luck! 🚀**

---
---

# 📊 실제 작업 결과 (Session 1)

> **작성**: Session 2 (문서화)
> **작업 완료**: 2025-11-21 14:45
> **총 소요 시간**: 45분 (14:00 ~ 14:45)

---

## ✅ 완료된 작업

### 1. 신규 슬라이드 추가 (6개)

#### 2-1. 홀덤 기본 구조 슬라이드
1. **"Texas Hold'em이란?"**
   - Player vs player 컨셉 강조
   - 7장 중 5장 선택 메커니즘 설명

2. **"게임 흐름"**
   - 5단계 흐름 시각화:
     - 프리플랍 (Pre-flop) - 홀 카드 2장
     - 플랍 (Flop) - 커뮤니티 카드 3장
     - 턴 (Turn) - 커뮤니티 카드 1장 추가
     - 리버 (River) - 마지막 카드
     - 쇼다운 (Showdown) - 승자 결정

3. **"플레이어의 선택"**
   - 폴드 (Fold): 포기
   - 콜 (Call): 따라가기
   - 레이즈 (Raise): 올리기
   - CSS 클래스 `.action-card` 활용

#### 2-3. 게임 시뮬레이션 확장 (3개 슬라이드로 분리)
4. **프리플랍 (Pre-flop)**
   - Starting hand: A♠K♠
   - Decision: RAISE
   - 이유: 강한 시작 핸드

5. **플랍 (Flop)**
   - Board: Q♠J♠3♣
   - 아웃츠 계산: 12 outs (48% 승률)
   - 팟 오즈: 36.4% 필요
   - Decision: CALL
   - 아웃츠 개념 통합 설명

6. **턴 (Turn)**
   - Board: Q♠J♠3♣10♠
   - 완성: Royal Straight Flush
   - 결과 표시

#### Act 3 연결
7. **"더 깊이 들어가기"**
   - Implied Odds
   - Range Analysis
   - ICM (Independent Chip Model)
   - GTO vs Exploit 전략

### 2. 기존 콘텐츠 보존
- ✅ 족보 52장 카드 덱 그리드 (Royal Flush, Flush, One Pair)
- ✅ Fragment 애니메이션 (data-fragment-index)
- ✅ 팟 오즈 계산 슬라이드
- ✅ 직관 vs 수학 대비 슬라이드

### 3. 결과
**슬라이드 수**: 22개 → **28개** (+6)
**Act 2 예상 시간**: 8-10분 (목표 유지)

---

## 📈 개선 전후 비교

### 개선 전 (Act 2: 10 slides)
```
1. 족보 소개
2-4. 족보 예시 (Royal Flush, Flush, One Pair)
5. Texas Hold'em 특징
6. 포커 테이블
7. 게임 시뮬레이션 (한 슬라이드에 압축)
8. 수학적 사고
9. 직관 vs 수학
10. 핵심 메시지
```

**문제점**:
- ❌ 게임 룰 전 족보 시작
- ❌ 게임 흐름 설명 부족
- ❌ 플레이어 선택 설명 없음
- ❌ 시뮬레이션 압축 (의사결정 과정 부족)

### 개선 후 (Act 2: 16 slides)
```
1. Texas Hold'em이란?  [NEW]
2. 게임 흐름 (5단계)  [NEW]
3. 플레이어 선택 (Fold/Call/Raise)  [NEW]
4. 족보 소개
5-7. 족보 예시 (Royal Flush, Flush, One Pair)
8. Texas Hold'em 특징
9. 포커 테이블
10. Pre-flop 시뮬레이션  [NEW]
11. Flop 시뮬레이션 + 아웃츠  [NEW]
12. Turn 시뮬레이션  [NEW]
13. 수학적 사고
14. 직관 vs 수학
15. 핵심 메시지
16. Act 3 예고  [NEW]
```

**개선점**:
- ✅ 논리적 순서: 홀덤 소개 → 게임 흐름 → 플레이어 선택 → 족보 → 시뮬레이션
- ✅ 게임 이해를 위한 기초 제공
- ✅ 시뮬레이션 3단계 분리 (각 단계 의사결정 명시)
- ✅ 아웃츠 개념 통합 설명
- ✅ Act 3 연결 슬라이드

---

## 🎯 목표 달성 여부

### Outline 의도 구현

#### ✅ 2-1. 홀덤의 기본 구조
- ✅ 카드 배분 설명
- ✅ 게임 흐름 5단계
- ✅ 플레이어 선택 3가지
- ✅ Player vs player 강조

#### ✅ 2-2. 확률의 세계
- ✅ 족보 조합 수 (기존 유지)
- ✅ 직관 vs 수학 (기존 유지)

#### ✅ 2-3. 실전 시나리오
- ✅ A♠K♠ 시뮬레이션 3단계 분리
- ✅ 아웃츠 계산 (12 outs = 48%)
- ✅ 팟 오즈 비교 (36.4% 필요)
- ✅ 각 단계 의사결정 명시

#### ✅ Act 3 연결
- ✅ 예고 슬라이드 추가 (Implied Odds, Range, ICM, GTO)

---

## 💡 배운 점 (Lessons Learned)

### 1. 피드백 시스템의 효과

**문제**: Session 1이 처음 Act 2를 구현했을 때, outline.md의 의도를 완전히 반영하지 못함.

**해결**: Session 2가 독립적으로 리뷰 후 상세 가이드(ACT2-FEEDBACK-AND-GUIDE.md) 작성.

**결과**:
- Session 1이 27KB 가이드 참조해 명확히 개선
- Slide-by-slide 스펙과 HTML 예시가 특히 유용
- 45분 만에 완료 (가이드 없었다면 훨씬 길었을 것)

**패턴**:
> **"Review → Detailed Guide → Execution" 사이클이 효과적**

### 2. 체크리스트의 중요성

**Good**:
- 가이드에 Priority 1/2/3 구분 명확
- HTML 예시 코드 제공
- Fragment 사용 예시 구체적

**Could be better**:
- 작업 순서를 더 명확히 할 수도 있었음 (예: "Step 1 → Step 2")
- CSS 파일 수정 필요 여부 언급

**배운 점**:
> **구체적 예시 > 추상적 설명**

### 3. 병렬 작업과 Lock 시스템

**상황**: Session 1이 Act 2 작업 중, Session 3은 Act 3-5 작성.

**전략**:
- Session 3이 `sections/` 폴더로 분리해 작업
- Session 1은 `index.html` 직접 수정
- 충돌 제로

**나중 과제**:
- Session 1의 Act 2 → `sections/act2.html` 동기화 필요
- `index.html` → `index.tobe.html` 마이그레이션 고려

**배운 점**:
> **파일 분리 전략으로 병렬 작업 가능**

### 4. Optional vs Mandatory

**이슈**: Session 1이 가이드 변환을 "Optional"로 표시해 미완료.

**결과**: Session 2가 나중에 정리 (이 문서).

**개선**:
- Optional 작업은 명확히 "다른 세션이 할 수도 있다" 명시
- 또는 "완료 후 체크리스트"에서 제외

**배운 점**:
> **체크리스트의 모든 항목은 필수여야 함. Optional은 별도 섹션으로.**

---

## 📊 Claude Code 활용 방법론

### 사용된 도구 및 패턴

1. **Read tool**:
   - `outline.md` 의도 파악
   - 기존 `index.html` Act 2 구조 분석
   - 가이드 파일 읽고 작업 진행

2. **Edit tool**:
   - 신규 슬라이드 삽입 (`<section>` 단위)
   - Fragment 애니메이션 추가
   - 기존 콘텐츠 보존하며 수정

3. **TodoWrite tool** (추정):
   - 가이드의 체크리스트 → Todo 변환
   - 진행 상황 체크

4. **Bash tool**:
   - Git commit (작은 단위)
   - Reveal.js 테스트

### 효과적이었던 점

- **Detailed guide**: 27KB 가이드가 Session 1의 명확한 지침 제공
- **HTML 예시**: Copy-paste 가능한 코드 스니펫
- **Fragment 패턴**: data-fragment-index 사용법 명시
- **Checklist**: Priority 구분으로 작업 순서 명확

### 개선 가능했던 점

- **Live preview**: 브라우저에서 즉시 확인하며 조정 (시간 단축)
- **CSS 가이드**: `.action-card` 같은 스타일 가이드 미리 제공
- **Timing check**: 각 슬라이드 예상 시간 측정

---

## 🔗 관련 파일

- **가이드 원본**: `ACT2-FEEDBACK-AND-GUIDE.md` (작업 완료 후 삭제 예정)
- **Outline**: `outline.md` (lines 36-103)
- **구현**: `index.html` (lines 84-715, Act 2 section)
- **세션 관리**: `SESSION-STATE.md`, `SESSION-RULES.md`
- **Git commit**: `87d2fe5` - `[Session1] Feat: Complete Act 2 improvements`

---

## 📝 다음 단계 (Backlog)

1. **Act 2 동기화**:
   - `index.html` Act 2 → `sections/act2.html` 반영

2. **Index 마이그레이션**:
   - `index.html` → `index.tobe.html` 전환 테스트

3. **Design improvements**:
   - `DESIGN-FEEDBACK.md` 참조해 CSS 리팩토링

4. **End-to-end testing**:
   - 전체 발표 시간 측정 (목표: 30-35분)

---

**Last updated**: 2025-11-21 (Session 2)
