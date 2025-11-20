# Session Management Rules

> **목적**: 여러 세션이 동시에 작업할 때의 규칙과 워크플로우
> **읽기 전용**: 이 파일은 규칙을 정의합니다. 세션 상태는 `SESSION-STATE.md`를 참조하세요.

**Related**: 📊 [SESSION-STATE.md](./SESSION-STATE.md) - 현재 세션 상태 및 Lock 정보

---

## 📖 Rules & Workflow

### 작업 시작 전

1. **SESSION-STATE.md를 읽기**
   - 자기 세션 찾기
   - Status 확인
   - Locked Resources 확인

2. **Conflict 체크**
   - 다른 세션이 lock한 파일은 수정 금지
   - 같은 파일의 다른 라인이면 조심스럽게 가능

3. **의존성 확인**
   - "Waiting for" 있으면 기다리거나 다른 작업
   - Queue에서 Ready 작업 찾기

---

### 작업 중

1. **Lock한 리소스만 수정**
   - 명시된 파일/라인 범위 내에서만
   - 다른 곳 수정 필요하면 SESSION-STATE.md에 먼저 추가

2. **주기적으로 commit & push**
   - 작은 단위로 자주 커밋
   - Commit message: `[SessionX] 작업내용`
   - 예시:
     ```bash
     git add index.html
     git commit -m "[Session1] Act 2: Add game flow slides"
     git push
     ```

3. **진행 상황 업데이트**
   - SESSION-STATE.md의 Tasks 체크리스트 업데이트
   - 예상보다 오래 걸리면 Estimated completion 수정

---

### ⚠️ 작업 완료 후 (반드시 확인!)

**체크리스트: 모두 완료해야 진짜 완료**

- [ ] **1. 최종 commit & push**
      ```bash
      git add .
      git commit -m "[SessionX] Complete: 작업 설명"
      git push
      ```

- [ ] **2. 작업 가이드 문서 변환 (있는 경우)**
      - 예: ACT2-FEEDBACK-AND-GUIDE.md → development-log/act2-improvement-history.md
      - 실제 적용 내용, 소요 시간, 배운 점 추가

- [ ] **3. SESSION-STATE.md 업데이트**
      - Status: Working → ✅ Completed
      - Locked Resources 해제 (None)
      - Tasks 모두 체크
      - Last commit 업데이트
      - Completed timestamp 기록

- [ ] **4. Blocking하던 세션에 알림**
      - SESSION-STATE.md의 Task Queue 업데이트
      - Waiting 세션을 Ready로 변경

**⚠️ 위 4단계 모두 완료하지 않으면 다음 세션이 시작 못합니다!**

---

### Conflict 발생 시

1. **원인 파악**
   ```bash
   git log <file> --oneline
   # 누가 수정했는지 확인
   ```

2. **SESSION-STATE.md 확인**
   - 누가 lock을 걸었는지
   - Lock 없이 수정했다면 프로세스 위반

3. **조율**
   - Lock을 무시한 경우: 사용자에게 알리고 조율
   - 정당한 수정 충돌: Git merge 도구로 해결

---

## 💡 Tips & Best Practices

### 세션 시작 시
```
User: "너는 Session 1이야"
Session 1: SESSION-STATE.md 읽음
Session 1: "네, Session 1입니다. Act 2 개선 작업을 하겠습니다."
Session 1: "index.html lines 84-715을 수정하겠습니다."
Session 1: "먼저 ACT2-FEEDBACK-AND-GUIDE.md를 읽고 시작하겠습니다."
```

### 다른 세션이 끼어들 때
```
User: "Act 3 시작할래?"
Session 3: SESSION-STATE.md 읽음
Session 3: "Session 3은 현재 Waiting 상태입니다."
Session 3: "Session 1이 Act 2를 완료해야 시작할 수 있습니다."
Session 3 → User: "Session 1이 완료될 때까지 기다릴까요?
                  아니면 다른 작업(Act 4 draft 등)을 먼저 할까요?"
```

### 병렬 작업이 가능한 경우
```
Session 2: "저는 development-log 업데이트를 하겠습니다."
Session 2: SESSION-STATE.md 확인
Session 2: "다른 세션이 development-log를 lock하지 않았으므로 진행 가능합니다."
Session 2: "development-log/* 를 lock하고 작업 시작하겠습니다."
```

### 가이드 문서 활용
- 복잡한 작업은 별도 가이드 문서 작성 (예: ACT2-FEEDBACK-AND-GUIDE.md)
- 가이드에는 구체적 작업 내용, HTML 예시, 체크리스트 포함
- 작업 완료 후 development-log로 이동해 히스토리 보존

---

## 📚 Related Files

### 상태 관리
- **`SESSION-STATE.md`** ⭐: 현재 세션 상태, Lock 정보, Task Queue

### 프로젝트 가이드
- **`development-log/CLAUDE.md`**: 프로젝트 전체 원칙 및 목적
- **`outline.md`**: 발표 전체 구조 및 의도
- **`development-log/`**: 작업 방법론 문서화

### 작업 가이드 (작업별)
- **`ACT2-FEEDBACK-AND-GUIDE.md`**: Session 1용 Act 2 개선 가이드
- **`DESIGN-FEEDBACK.md`**: Session 5용 디자인 개선 피드백

---

## 🎯 핵심 원칙

1. **투명성**: SESSION-STATE.md에 항상 최신 상태 반영
2. **Lock 우선**: 다른 세션의 Lock 존중
3. **자주 commit**: 작은 단위로 자주 push
4. **완료 체크리스트**: 4단계 모두 완료해야 진짜 완료
5. **문서화**: 가이드 문서는 히스토리로 변환 보존

---

**Note**: 이 규칙은 Git conflict를 100% 방지하지는 못하지만, 대부분의 충돌을 사전에 예방하고 협업을 원활하게 합니다.

**Last updated**: 2025-11-21
