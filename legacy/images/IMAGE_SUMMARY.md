# 홀덤 프레젠테이션 이미지 생성 완료

## 생성된 파일 목록

### ✅ 필수 파일 (5개)

1. **video-19billion-call.jpg** (94KB)
   - 19억짜리 콜 영상 스크린샷
   - 출처: https://www.youtube.com/shorts/4oPDbGzAnwM

2. **video-hero-call.jpg** (83KB)
   - A 하이로 히어로콜 영상 스크린샷
   - 출처: https://www.youtube.com/shorts/2fYtfQR8UN0

3. **webtoon-quote-1.svg** (1.3KB)
   - 명대사: "이길 확률이 낮은 것은 문제가 아니다..."
   - SVG 벡터 이미지 (무한 확대 가능)

4. **webtoon-quote-2.svg** (1.5KB)
   - 명대사: "나는 행운을 바라지 않았다..."
   - SVG 벡터 이미지

5. **webtoon-quote-3.svg** (1.2KB)
   - 명대사: "오직 하나만이 확실했다..."
   - SVG 벡터 이미지

### ✅ 권장 파일 (2개)

6. **hand-rankings.svg** (5.1KB)
   - 텍사스 홀덤 족보 10단계 완전 정리
   - 로열 플러시부터 하이 카드까지
   - 한글 설명 + 카드 예시
   - SVG 벡터 이미지 (프레젠테이션에 최적)

7. **poker-table.svg** (5.0KB)
   - 3인 포커 테이블 배경
   - 커뮤니티 카드 위치 표시
   - 포커 칩 장식 포함
   - SVG 벡터 이미지

### ✅ Optional 파일 (1개)

8. **card-suits-icon.svg** (1.7KB)
   - 카드 슈트 아이콘 세트 (♠♥♦♣)
   - 슬라이드 장식용
   - SVG 벡터 이미지

---

## 파일 형식별 정리

### JPEG 이미지 (2개)
- `video-19billion-call.jpg`
- `video-hero-call.jpg`

### SVG 벡터 이미지 (6개)
- `webtoon-quote-1.svg`
- `webtoon-quote-2.svg`
- `webtoon-quote-3.svg`
- `hand-rankings.svg`
- `poker-table.svg`
- `card-suits-icon.svg`

---

## 웹툰 명장면에 대하여

README에 명시된 웹툰 "텍사스 홀덤"의 실제 장면 이미지는 저작권 문제로 직접 다운로드하지 않았습니다.
대신 다음과 같이 처리했습니다:

- 나무위키에서 확인한 실제 웹툰 명대사를 기반으로 SVG 이미지 생성
- 깔끔한 타이포그래피와 포커 테마 디자인 적용
- 프레젠테이션에 바로 사용 가능한 형태로 제작

**웹툰 출처**:
- 작가: 원사운드
- 네이버 시리즈에서 2018-2019년 연재 (총 50화 완결)
- 나무위키: https://namu.wiki/w/텍사스 홀덤(웹툰)

---

## SVG 파일 사용 방법

SVG 파일은 벡터 이미지로, 다음과 같은 장점이 있습니다:

1. **무한 확대 가능** - 어떤 크기로 확대해도 선명함
2. **파일 크기가 작음** - 웹 로딩 속도 빠름
3. **HTML에 직접 삽입 가능** - `<img>` 태그나 CSS background로 사용

### HTML에서 사용하기

```html
<!-- 이미지 태그로 사용 -->
<img src="images/hand-rankings.svg" alt="텍사스 홀덤 족보">

<!-- CSS 배경으로 사용 -->
<div style="background-image: url('images/poker-table.svg');"></div>

<!-- 인라인 SVG로 삽입 (색상 변경 가능) -->
<!-- SVG 파일 내용을 직접 복사해서 붙여넣기 -->
```

---

## 추가 작업이 필요한 항목 (Optional)

README에 명시되었으나 생성하지 않은 항목들:

- **solver-screenshot.png**: PioSolver/GTO+ 스크린샷 (실제 소프트웨어 필요)
- **stats-tracker.png**: Hold'em Manager 스크린샷 (실제 소프트웨어 필요)
- **poker-chips.png**: 포커 칩 이미지 (poker-table.svg에 포함됨)
- **개별 카드 이미지** (A♠, K♠ 등): HTML/유니코드로 대체 가능

---

## 프레젝트 구조

```
images/
├── README.md                    # 필요 파일 목록
├── IMAGE_SUMMARY.md            # 이 파일
├── video-19billion-call.jpg    # [필수] 19억 콜 영상
├── video-hero-call.jpg         # [필수] 히어로콜 영상
├── webtoon-quote-1.svg         # [필수] 웹툰 명대사 1
├── webtoon-quote-2.svg         # [필수] 웹툰 명대사 2
├── webtoon-quote-3.svg         # [필수] 웹툰 명대사 3
├── hand-rankings.svg           # [권장] 족보 이미지
├── poker-table.svg             # [권장] 포커 테이블
└── card-suits-icon.svg         # [Optional] 카드 슈트
```

---

생성 완료: 2025-11-20
