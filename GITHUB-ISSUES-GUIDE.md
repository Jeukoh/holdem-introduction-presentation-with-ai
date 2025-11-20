# GitHub Issues Usage Guide

> **목적**: 다중 세션 협업을 위한 GitHub Issues 워크플로우 가이드
> **대상**: 이 프로젝트에서 작업하는 모든 Claude 세션
> **업데이트**: 2025-11-21

---

## 📋 빠른 참조

### 이슈 생성 시기
✅ **생성해야 할 때**:
- 크로스세션 작업 (다른 세션이 할 수도 있는 작업)
- 버그나 디자인 개선사항 발견
- 블로킹 작업 (다른 작업이 이것을 기다림)
- 토론이 필요한 디자인/컨텐츠 결정
- 평가 문서에서 식별된 개선사항

❌ **생성하지 말아야 할 때**:
- 30분 미만의 즉시 수정 가능한 작업
- 현재 세션에서 바로 처리 중인 작업
- SESSION-STATE.md에만 있는 세션 전용 체크리스트

### 워크플로우 5단계

```bash
# 1. 가용 작업 확인
gh issue list --label "phase: ready" --label "session: unassigned"

# 2. 이슈 클레임
gh issue comment 7 --body "Session 6 claiming this"

# 3. SESSION-STATE.md 업데이트 (Locked Resources, Tasks 추가)

# 4. 작업 수행 및 커밋
git commit -m "[Session6] Fix #7: Description\n\nFixes #7"

# 5. Push (자동으로 이슈 close)
git push
```

---

## 🏷️ 라벨 시스템

### Type Labels (필수, 하나만 선택)
- `type: bug` - 뭔가 깨짐
- `type: design` - UI/UX 개선
- `type: content` - 발표 컨텐츠
- `type: infra` - 프로젝트 구조
- `type: research` - 조사 필요
- `type: enhancement` - 새 기능

### Priority Labels (필수, 하나만 선택)
- `priority: critical` - 블로킹, 발표 불가
- `priority: high` - 품질에 중요
- `priority: medium` - 가치있지만 급하지 않음
- `priority: low` - 있으면 좋음

### Session Labels (선택)
- `session: 1` - Act 2 개선
- `session: 2` - 방법론 & 리뷰
- `session: 3` - Act 3-5 & 구조
- `session: 5` - 디자인 & UI/UX
- `session: unassigned` - 아무나 가능

### Phase Labels (선택)
- `phase: planning` - 접근 방법 결정 필요
- `phase: ready` - 구체화됨, 바로 작업 가능
- `phase: in-progress` - 현재 작업 중
- `phase: review` - 검증 필요
- `phase: blocked` - 의존성 대기 중

### Area Labels (선택, 복수 가능)
- `area: act1` ~ `area: act5` - 발표 Act
- `area: css` - 스타일 시스템
- `area: responsive` - 반응형
- `area: accessibility` - 접근성

---

## 📝 이슈 생성 가이드

### 새 이슈 만들기

**방법 1: GitHub CLI**
```bash
gh issue create \
  --title "[Design] Fix card overlap at 768px" \
  --body "Description here" \
  --label "type: design" \
  --label "priority: high"
```

**방법 2: 웹 UI**
1. https://github.com/Jeukoh/holdem-introduction-presentation-with-ai/issues/new/choose
2. 템플릿 선택 (Standard Task 또는 Quick Task)
3. 양식 작성
4. Submit

### 이슈 구조 (Standard Task 템플릿)

```markdown
## Description
명확한 설명

## Type
- [x] Bug / Design / Content / etc.

## Priority
- [x] Critical / High / Medium / Low

## Location
**Files**: css/custom.css lines 100-120

## Proposed Solution
구현 방법 설명

## Estimated Time
~2 hours

## Session Assignment
Suggested: Session 5 (Design specialist)
Blocked by: None

## Testing Checklist
- [ ] Browser verification
- [ ] Responsive test
- [ ] No console errors

## Related Issues
- Relates to: #10
- Blocks: #15
```

---

## 🔄 워크플로우 상세

### 이슈 클레임하기

**1. SESSION-STATE.md 충돌 체크**
```bash
# SESSION-STATE.md 읽고 다른 세션이 같은 파일 lock했는지 확인
cat SESSION-STATE.md | grep -A 10 "Locked Resources"
```

**2. 이슈 클레임**
```bash
ISSUE_NUM=7
gh issue comment $ISSUE_NUM --body "Session 6 claiming this issue"
gh issue edit $ISSUE_NUM \
  --add-label "session: 6" \
  --add-label "phase: in-progress" \
  --remove-label "session: unassigned"
```

**3. SESSION-STATE.md 업데이트**
```markdown
### Session 6: CSS System Cleanup

Status: 🔄 Working

Locked Resources:
- css/custom.css
- css/style.css

GitHub Issues:
- #7 (in-progress)

Tasks:
- [ ] Fix video container centering (Issue #7)
- [ ] Verify responsive behavior
```

### 작업 완료하기

**1. 커밋 메시지 작성**
```bash
git commit -m "[Session6] Fix #7: Center video container properly

Adjusted margin calculation from 2em auto to margin-left/right centering.
Tested on 1920px, 768px, 480px breakpoints.

Fixes #7"
```

**커밋 키워드**:
- `Fixes #7` / `Closes #7` / `Resolves #7` → 이슈 자동 close
- `Part of #7` / `Relates to #7` / `Re #7` → 링크만 (close 안됨)

**2. Push & 검증**
```bash
git push
gh issue view 7  # Should show "Closed"
```

**3. SESSION-STATE.md 정리**
```markdown
### Session 6: CSS System Cleanup

Status: ✅ Completed

Completed Tasks:
- [x] Fix video container centering (Issue #7)

GitHub Issues: #7 (closed)

Locked Resources: None (released)
```

---

## 🔗 SESSION-STATE.md 통합

### 양방향 참조

**SESSION-STATE.md에서**:
```markdown
### Session 6: Design Work

GitHub Issues:
- #4 (in-progress) - Two-column CSS conflicts
- #7 (next) - Video container centering

Tasks:
- [ ] Fix two-column layout (Issue #4)
```

**GitHub Issue에서**:
```markdown
## Session Assignment
**Assigned to**: Session 6
**Tracking**: SESSION-STATE.md (Session 6 section)
**Locked Resources**: css/custom.css, css/style.css
```

### 동기화 규칙

| 시점 | SESSION-STATE.md | GitHub Issue |
|------|------------------|--------------|
| 세션 시작 | Locked Resources 추가 | Label: `phase: in-progress`, `session: X` |
| 작업 중 | Checklist 업데이트 | Comment if blocked |
| 완료 | Status → Completed, Resources 해제 | Commit with `Fixes #N` → auto-close |

---

## 🎯 실전 예제

### 예제 1: 버그 발견 및 수정

**상황**: Slide에서 카드가 겹치는 버그 발견

```bash
# 1. 이슈 생성
gh issue create \
  --title "[Bug] Cards overlapping at 768px breakpoint" \
  --body "Community cards in Act 2 overlap on tablet devices..." \
  --label "type: bug" \
  --label "priority: high" \
  --label "area: act2" \
  --label "area: responsive"

# 2. SESSION-STATE.md 확인
# (css/custom.css가 unlock되어 있음을 확인)

# 3. 이슈 클레임
gh issue comment 13 --body "Session 5 claiming - fixing responsive card layout"
gh issue edit 13 --add-label "session: 5" --add-label "phase: in-progress"

# 4. SESSION-STATE.md 업데이트
# (Locked Resources에 css/custom.css 추가)

# 5. 작업 수행
# (CSS 수정: .community-cards max-width 추가)

# 6. 커밋
git add css/custom.css
git commit -m "[Session5] Fix #13: Resolve card overlap at 768px

Added max-width: 95% to .community-cards for responsive wrapping.
Tested on iPad and mobile breakpoints.

Fixes #13"

# 7. Push (이슈 자동 close)
git push

# 8. SESSION-STATE.md 완료 처리
```

### 예제 2: 크로스세션 작업

**상황**: Session 3가 Act 4 개선 작업 시작, Session 6이 이어받음

```markdown
# Session 3가 이슈 생성
gh issue create \
  --title "[Content] Reduce Act 4 from 26 to 15 slides" \
  --body "Evaluation identified Act 4 as too long..." \
  --label "type: content" \
  --label "priority: high" \
  --label "area: act4" \
  --label "session: unassigned"

# Session 3가 일부 작업 후 중단
git commit -m "[Session3] Content: Combine comparison slides in Act 4

Part of #14
- Merged slides 78-113 into single infographic"

# Session 6이 나머지 이어받음
gh issue comment 14 --body "Session 6 continuing from Session 3's work"
gh issue edit 14 --add-label "session: 6"

# Session 6이 완료
git commit -m "[Session6] Fix #14: Complete Act 4 slide reduction

Built on Session 3's comparison merge.
Cut 11 more slides by consolidating philosophy sections.

Fixes #14"
```

---

## 📊 이슈 관리

### 이슈 목록 보기

```bash
# 내가 할 수 있는 작업
gh issue list --label "phase: ready" --label "session: unassigned"

# Critical 우선순위
gh issue list --label "priority: critical" --state open

# 특정 Act 관련
gh issue list --label "area: act3" --state open

# 최근 활동 없는 이슈 (stale check)
gh issue list --search "is:open updated:<2025-11-14"
```

### 이슈 업데이트

```bash
# Priority 변경
gh issue edit 5 --remove-label "priority: low" --add-label "priority: high"

# Phase 전환
gh issue edit 5 --remove-label "phase: planning" --add-label "phase: ready"

# Blocked 표시
gh issue edit 5 --add-label "phase: blocked"
gh issue comment 5 --body "Blocked by #10 - waiting for diagram system"

# 설명 업데이트
gh issue edit 5 --body "Updated description with new findings..."
```

---

## ⚠️ 주의사항 & 베스트 프랙티스

### DO ✅

1. **이슈 생성 전 검색**: 중복 방지
   ```bash
   gh issue list --search "card overlap"
   ```

2. **명확한 제목**: `[Type] 구체적 설명`
   - 좋음: `[Bug] Cards overlap at 768px in Act 2`
   - 나쁨: `Fix cards`

3. **Location 명시**: 파일명과 라인 번호
   ```markdown
   **Files**: css/custom.css lines 420-450
   ```

4. **Estimated Time 제공**: 다른 세션이 판단할 수 있도록
   ```markdown
   **Estimated Time**: ~1-2 hours
   ```

5. **Commit에 이슈 번호 포함**: 추적 가능성
   ```bash
   git commit -m "[SessionX] Fix #N: Description"
   ```

### DON'T ❌

1. **여러 문제를 하나의 이슈로**: 각각 별도 이슈 생성
2. **Vague descriptions**: "Fix design" 같은 불명확한 설명
3. **라벨 없이 생성**: 최소 type + priority는 필수
4. **SESSION-STATE.md 동기화 생략**: 항상 양쪽 업데이트
5. **Close without commit reference**: 추적 불가능

---

## 🆘 문제 해결

### 이슈가 자동 close 안됨

**원인**: Commit message에 키워드 없음

**해결**:
```bash
# 커밋 메시지 수정 (아직 push 안했다면)
git commit --amend -m "[SessionX] Fix #7: Description\n\nFixes #7"

# 이미 push했다면 수동 close
gh issue close 7 --comment "Fixed in commit abc1234"
```

### 이슈가 blocked 상태

**대응**:
1. Blocking issue를 먼저 확인
   ```bash
   gh issue view 5  # "Blocked by: #10" 확인
   gh issue view 10  # 상태 확인
   ```

2. Blocker가 해결되면 알림
   ```bash
   gh issue comment 5 --body "Blocker #10 resolved, ready to proceed"
   gh issue edit 5 --remove-label "phase: blocked" --add-label "phase: ready"
   ```

### 다른 세션과 충돌

**예방**:
- SESSION-STATE.md Locked Resources 항상 체크
- 같은 파일 건드리는 이슈는 순차 처리

**발생 시**:
```bash
# 이슈에 코멘트 남기고 대기
gh issue comment 7 --body "Waiting for Session 5 to finish with css/custom.css"
gh issue edit 7 --add-label "phase: blocked"
```

---

## 📚 관련 문서

- **SESSION-RULES.md**: 세션 작업 규칙
- **SESSION-STATE.md**: 현재 세션 상태 및 Lock 정보
- **PRESENTATION-EFFECTIVENESS-EVALUATION.md**: 개선사항 평가
- **DESIGN-FEEDBACK.md**: 디자인 피드백
- **.github/ISSUE_TEMPLATE/**: 이슈 템플릿

---

## 🔄 버전 기록

- **2025-11-21**: 초기 버전 생성 (Session 2)
  - 기본 워크플로우 정의
  - 라벨 시스템 확립
  - SESSION-STATE.md 통합 규칙

---

**Questions?** SESSION-RULES.md의 "GitHub Issues Integration" 섹션 참조
