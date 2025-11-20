# ⚠️ 이 파일은 이동되었습니다

이 파일은 두 개의 파일로 분리되었습니다:

## 📖 세션 작업 규칙
👉 **[SESSION-RULES.md](./SESSION-RULES.md)**
- 작업 시작 전/중/완료 후 워크플로우
- Conflict 처리 방법
- Tips & Best Practices
- **읽기 전용** - 규칙 참조용

## 📊 세션 상태 및 Lock 정보
👉 **[SESSION-STATE.md](./SESSION-STATE.md)**
- 현재 세션 상태 (Status, Identity)
- Locked Resources
- Tasks 체크리스트
- Task Queue
- **자주 업데이트** - 작업 진행 상황 반영

---

## 왜 분리했나요?

**문제**: SESSION-LOCK.md가 300+ 줄로 너무 길고, 규칙과 상태가 섞여 있었습니다.
- 규칙(Rules): 거의 안 바뀜, 읽기 전용
- 상태(State): 자주 바뀜, 각 세션이 업데이트

**해결**: 책임 분리 (Separation of Concerns)
- 세션이 상태 업데이트 시 실수로 규칙 수정 방지
- 각 파일이 짧고 명확해짐
- Git history가 깔끔해짐

---

**Last updated**: 2025-11-21 01:30
