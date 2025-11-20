# Session Lock & Management

> **목적**: 여러 세션이 동시에 작업할 때 충돌 방지 및 작업 순서 관리
> **업데이트**: 각 세션은 작업 시작/완료 시 이 파일을 업데이트합니다.

**Last updated**: 2025-11-21 01:00
**Active sessions**: 1 working, 1 completed, 1 idle, 1 completed (design)

---

## 📋 Active Sessions

### Session 1: Act 2 Improvement

**Status**: ✅ Completed
**Identity**: "나는 Session 1입니다. Act 2 개선 작업을 담당합니다."

**Locked Resources**: None (released)

**Completed Tasks**:
- [x] Read `ACT2-FEEDBACK-AND-GUIDE.md`
- [x] Add "홀덤 기본 구조" slides (2-1 section)
  - [x] "Texas Hold'em이란?" - Player vs player concept
  - [x] "게임 흐름" - 5-stage flow (Pre-flop to Showdown)
  - [x] "플레이어의 선택" - Fold/Call/Raise actions with .action-card CSS
- [x] Add "게임 흐름" explanation (프리플랍/플랍/턴/리버)
- [x] Add "플레이어 선택" explanation (폴드/콜/레이즈)
- [x] Expand game simulation to 3 slides
  - [x] Pre-flop: A♠K♠ starting hand, RAISE decision
  - [x] Flop: Q♠J♠3♣, outs calculation (12 outs = 48%), pot odds (36.4% needed), CALL decision
  - [x] Turn: 10♠ completes Royal Straight Flush
- [x] Add "아웃츠" concept explanation (integrated in Flop slide)
- [x] Add Act 3 preview slide (Implied Odds, Range Analysis, ICM, GTO vs Exploit)
- [x] Test all fragments and transitions (verified in browser: 28 slides total)
- [ ] **Optional: Convert guide to history** (can be done by another session)
  - Move `ACT2-FEEDBACK-AND-GUIDE.md` → `development-log/act2-improvement-history.md`
  - Add sections: 실제 적용 내용, 소요 시간, 배운 점

**Blocking**: None (Act 2 completed, Session 3 can proceed if needed)

**Started**: 2025-11-21 14:00
**Completed**: 2025-11-21 14:45 (실제 작업 시간: 45분)
**Last commit**: `[Session1] Feat: Complete Act 2 improvements` (87d2fe5)

---

### Session 2: Methodology & Review

**Status**: ✅ Idle (completed feedback)
**Identity**: "나는 Session 2입니다. 방법론 문서화와 리뷰를 담당합니다."

**Locked Resources**: None

**Completed Tasks**:
- [x] Review Act 2 implementation independently
- [x] Compare with outline.md
- [x] Create `ACT2-FEEDBACK-AND-GUIDE.md`
- [x] Create `SESSION-LOCK.md`
- [x] Update CLAUDE.md

**Available for**:
- Act 4/5 content review
- Design feedback
- Development log updates

**Last commit**: `[Session2] Docs: Create session management system`

---

### Session 3: Act 3-5 & New Structure

**Status**: ✅ Completed
**Identity**: "나는 Session 3입니다. Act 3-5 작성과 새 파일 구조를 담당합니다."

**Locked Resources**:
- 📄 `sections/` (entire directory - created)
- 📄 `sections/act1.html` (extracted from index.html)
- 📄 `sections/act2.html` (extracted from index.html, lines 83-716)
- 📄 `sections/act3.html` (newly created)
- 📄 `sections/act4.html` (newly created)
- 📄 `sections/act5.html` (newly created)
- 📄 `index.tobe.html` (newly created - dynamic loading structure)

**Completed Tasks**:
- [x] Create sections/ folder structure
- [x] Extract Act 1 to sections/act1.html
- [x] Extract Act 2 to sections/act2.html (83-716 lines)
- [x] Write Act 3: 깊이 - 전략과 의사결정 (16.4 KB)
  - [x] 프로의 기본 도구함 (Pot Odds, Outs, EV)
  - [x] GTO vs Exploit 전략
  - [x] 프로의 실제 운영
  - [x] 메타데이터의 세계 (Implied Odds, ICM, Range)
  - [x] 두 가지 근본 질문
- [x] Write Act 4: 통찰 - 모든 것은 도박이다, 하지만... (17.8 KB)
  - [x] 솔직한 고백
  - [x] +EV 전략의 존재 (홀짝 vs 섯다 vs 홀덤)
  - [x] 피드백과 반성의 가능성
  - [x] 과정과 결과 (+EV vs +V)
  - [x] 내가 홀덤을 좋아하는 이유 (웹툰 인용)
  - [x] 질문을 다시 꺼내며
- [x] Write Act 5: 초대 - 함께 즐길 사람을 찾습니다 (6.8 KB)
  - [x] 진짜 목적
  - [x] 시작하는 방법
  - [x] 마무리
- [x] Create index.tobe.html (dynamic loading structure)
- [x] Fix Act 2 extraction issue (83-716 lines, not 83-344)

**Strategy**:
Session 1과 병렬 작업을 위해 파일 분리 구조 채택:
- Session 1: index.html 계속 작업 (Act 2 개선)
- Session 3: sections/*.html 작업 (충돌 제로)
- 나중에 sections/act2.html과 Session 1 작업 동기화 필요

**Next Steps**:
- [ ] Coordinate with Session 1 for Act 2 synchronization
- [ ] Test index.tobe.html in browser
- [ ] Consider migrating index.html → index.tobe.html

**Started**: 2025-11-20 23:50
**Completed**: 2025-11-21 00:30
**Last commit**: `[Session3] Feat: Create Act 3-5 and new file structure`

---

### Session 5: Design Feedback

**Status**: ✅ Completed (Extended)
**Identity**: "나는 Session 5입니다. 디자인 개선 피드백을 생성합니다."

**Locked Resources**:
- 📄 `DESIGN-FEEDBACK.md` (created & updated)

**Completed Tasks**:
- [x] 현재 디자인 상태 종합 분석 (CSS, HTML, 시각적 일관성)
- [x] 색상 팔레트 및 타이포그래피 일관성 검토
- [x] 레이아웃 및 간격 개선점 도출
- [x] 인터랙티브 요소 및 애니메이션 개선 제안
- [x] 접근성 및 사용자 경험 개선 제안
- [x] 디자인 개선 피드백 문서 작성 (DESIGN-FEEDBACK.md)
- [x] **UI/UX 레이아웃 버그 분석** (실제 겹침/깨짐 문제)
  - [x] 포커 테이블 플레이어 위치 충돌 분석
  - [x] 카드 그리드 겹침 문제 분석
  - [x] z-index 충돌 문제 식별
  - [x] 프래그먼트 애니메이션 점프 분석
  - [x] 반응형 부재로 인한 모바일 깨짐 분석
  - [x] 22개 구체적 레이아웃 버그 문서화 (라인 번호 포함)

**Key Findings**:

*디자인 시스템*:
- ✅ 색상 시스템 잘 구축됨 (CSS 변수 활용)
- ⚠️ 일부 하드코딩된 색상 존재 (CSS 변수로 통일 필요)
- ⚠️ 반응형 디자인 미흡 (모바일 대응 필요)
- ⚠️ 접근성 개선 필요 (focus styles, ARIA 속성, 색맹 사용자 고려)
- ⚠️ 간격 시스템 비일관성 (spacing scale 필요)

*UI/UX 레이아웃 버그* (10개 카테고리, 22개 이슈):
- 🔴 Critical (5개): 포커 테이블 위치 충돌, 카드 겹침, 팟 표시 겹침, z-index 충돌, 모바일 반응형 부재
- 🟡 Medium (4개): 프래그먼트 점프, 고정 픽셀 크기, 포뮬라 빌더 간격, CSS 중복
- 🟢 Low (13개): 마이너 간격/오버플로우 이슈

**Available for**:
- 디자인 개선사항 실제 구현 (CSS 리팩토링)
- **레이아웃 버그 수정** (Critical 우선)
- 반응형 디자인 적용
- 접근성 개선 작업

**Started**: 2025-11-21 00:45
**Initial Completion**: 2025-11-21 01:00
**Extended Work**: 2025-11-21 01:15
**Last commit**: (pending - no code changes, documentation only)

---

## 📅 Task Queue

### Completed
1. ✅ **Act 3: 전략과 의사결정** (Session 3)
   - Completed: 2025-11-21 00:30
   - sections/act3.html (16.4 KB)

2. ✅ **Act 4: 통찰 - 모든 것은 도박이다, 하지만...** (Session 3)
   - Completed: 2025-11-21 00:30
   - sections/act4.html (17.8 KB)

3. ✅ **Act 5: 초대 - 함께 즐길 사람을 찾습니다** (Session 3)
   - Completed: 2025-11-21 00:30
   - sections/act5.html (6.8 KB)

### Ready
- *(None - Session 1 in progress)*

### Waiting
- *(None)*

### Backlog
1. **Act 2 Synchronization**
   - Needs: Session 1 completion
   - Merge Session 1's Act 2 improvements into sections/act2.html
   - Priority: High

2. **Index Migration**
   - Migrate from index.html to index.tobe.html
   - Test dynamic loading
   - Priority: Medium

3. **Design Implementation** (Based on DESIGN-FEEDBACK.md)
   - Phase 1: CSS 변수 확장, 반응형 디자인 기본, 접근성 기본 (Critical)
   - Phase 2: 간격 시스템, 타이포그래피 개선, 애니메이션 최적화 (Important)
   - Phase 3: CSS 리팩토링, ARIA 개선 (Nice to Have)
   - Ref: `DESIGN-FEEDBACK.md` 참조
   - Priority: Medium (Session 1 완료 후)

4. **Final Review**
   - End-to-end testing
   - Timing check (30-35min target)
   - Priority: High (but last)

---

## 📖 Rules & Workflow

### 작업 시작 전

1. **이 파일을 읽기**
   - 자기 세션 찾기
   - Status 확인
   - Locked Resources 확인

2. **Conflict 체크**
   - 다른 세션이 lock한 파일은 수정 금지
   - 같은 파일의 다른 라인이면 조심스럽게 가능

3. **의존성 확인**
   - "Waiting for" 있으면 기다리거나 다른 작업
   - Queue에서 Ready 작업 찾기

### 작업 중

1. **Lock한 리소스만 수정**
   - 명시된 파일/라인 범위 내에서만
   - 다른 곳 수정 필요하면 이 파일에 먼저 추가

2. **주기적으로 commit & push**
   - 작은 단위로 자주 커밋
   - Commit message: `[SessionX] 작업내용`

3. **진행 상황 업데이트**
   - Tasks 체크리스트 업데이트
   - 예상보다 오래 걸리면 Estimated completion 수정

### 작업 완료 후

1. **최종 commit & push**
   ```bash
   git add .
   git commit -m "[SessionX] 작업 설명"
   git push
   ```

2. **이 파일 업데이트**
   - Status: Working → Completed/Idle
   - Locked Resources 해제
   - Tasks 모두 완료 체크
   - Last commit 업데이트

3. **Blocking하던 세션 알림**
   - Queue에서 다음 작업 Ready로 이동
   - 해당 세션의 Status를 Waiting → Ready로 변경

### Conflict 발생 시

1. **원인 파악**
   ```bash
   git log <file> --oneline
   # 누가 수정했는지 확인
   ```

2. **이 파일 확인**
   - 누가 lock을 걸었는지
   - Lock 없이 수정했다면 프로세스 위반

3. **조율**
   - Lock을 무시한 경우: 사용자에게 알리고 조율
   - 정당한 수정 충돌: Git merge 도구로 해결

---

## 💡 Tips

### 세션 시작 시
```
User: "너는 Session 1이야"
Session 1: SESSION-LOCK.md 읽음
Session 1: "네, Session 1입니다. Act 2 개선 작업을 하겠습니다."
Session 1: "index.html lines 84-313을 수정하겠습니다."
Session 1: "먼저 ACT2-FEEDBACK-AND-GUIDE.md를 읽고 시작하겠습니다."
```

### 다른 세션이 끼어들 때
```
User: "Act 3 시작할래?"
Session 3: SESSION-LOCK.md 읽음
Session 3: "Session 3은 현재 Waiting 상태입니다."
Session 3: "Session 1이 Act 2를 완료해야 시작할 수 있습니다."
Session 3 → User: "Session 1이 완료될 때까지 기다릴까요?
                  아니면 다른 작업(Act 4 draft 등)을 먼저 할까요?"
```

### 병렬 작업이 가능한 경우
```
Session 2: "저는 development-log 업데이트를 하겠습니다."
Session 2: SESSION-LOCK.md 확인
Session 2: "다른 세션이 development-log를 lock하지 않았으므로 진행 가능합니다."
Session 2: "development-log/* 를 lock하고 작업 시작하겠습니다."
```

---

## 📚 Related Files

- **`ACT2-FEEDBACK-AND-GUIDE.md`**: Session 1을 위한 상세 작업 가이드
- **`DESIGN-FEEDBACK.md`**: Session 5의 디자인 개선 피드백 (색상, 타이포그래피, 레이아웃, 접근성)
- **`CLAUDE.md`**: 프로젝트 전체 가이드 및 원칙
- **`outline.md`**: 전체 발표 구조 및 의도
- **`development-log/`**: 작업 방법론 문서화

---

**Note**: 이 파일은 작업 조율을 위한 것입니다. Git conflict를 100% 방지하지는 못하지만, 대부분의 충돌을 사전에 예방할 수 있습니다.
