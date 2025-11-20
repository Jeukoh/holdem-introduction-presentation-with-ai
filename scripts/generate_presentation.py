#!/usr/bin/env python3
"""
Generate index.html presentation from scripts
"""

# HTML 템플릿 시작
html_header = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Texas Hold'em 소개 - 불확실성 속 합리적 의사결정</title>

    <!-- Reveal.js CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/black.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/custom.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="reveal">
        <div class="slides">
"""

html_footer = """
        </div>
    </div>

    <!-- Reveal.js Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
    <script>
        Reveal.initialize({
            hash: true,
            slideNumber: 'c/t',
            transition: 'slide',
            progress: true,
            center: true,
            controls: true,
            width: 1280,
            height: 720,
            margin: 0.1,
            minScale: 0.2,
            maxScale: 2.0
        });
    </script>
</body>
</html>
"""

# 슬라이드 생성 함수들
def act1_slides():
    return """
            <!-- ============================================
                 ACT 1: 시작 - 답하지 않을 질문들
                 ============================================ -->

            <!-- Title Slide -->
            <section data-background-gradient="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" class="title-slide">
                <h1>Texas Hold'em</h1>
                <h3>불확실성 속 합리적 의사결정 훈련 도구</h3>
                <p style="margin-top: 2em;">
                    <small>Jeuk Oh @ Letsur</small>
                </p>
            </section>

            <!-- Opening -->
            <section>
                <h2>오늘은 좀 특별한 주제로...</h2>
                <p class="fragment">바로... <span class="emphasize">Texas Hold'em</span>입니다.</p>
            </section>

            <!-- Video 1 -->
            <section>
                <h3>짧은 영상 두 개를 보여드리겠습니다</h3>
                <div class="video-container">
                    <div class="video-placeholder">
                        <p><strong>📹 영상 1: 19억짜리 콜</strong></p>
                        <p><small>images/video-19billion-call.jpg</small></p>
                        <p><a href="https://www.youtube.com/shorts/4oPDbGzAnwM" target="_blank">YouTube 링크</a></p>
                    </div>
                </div>
            </section>

            <!-- Video 2 -->
            <section>
                <div class="video-container">
                    <div class="video-placeholder">
                        <p><strong>📹 영상 2: A 하이로 히어로콜</strong></p>
                        <p><small>images/video-hero-call.jpg</small></p>
                        <p><a href="https://www.youtube.com/shorts/2fYtfQR8UN0" target="_blank">YouTube 링크</a></p>
                    </div>
                </div>
            </section>

            <!-- Hook -->
            <section>
                <h2>이게 홀덤입니다.</h2>
                <p class="fragment">짜릿하죠?</p>
                <p class="fragment" style="margin-top: 1.5em;">솔직히 말씀드리면, 이 발표의 목적은 간단합니다.</p>
                <p class="fragment emphasize">같이 홀덤 즐길 동료를 찾고 싶어서 이 자리에 섰습니다.</p>
            </section>

            <!-- Questions Intro -->
            <section>
                <h2>하지만 알고 있습니다</h2>
                <p>여러분 머릿속에 이미 많은 생각들이 스쳐 지나가고 있다는 걸.</p>
                <p class="fragment" style="margin-top: 1.5em;">그래서 본격적으로 시작하기 전에, 몇 가지 질문을 던지고 싶습니다.</p>
                <p class="fragment highlight-red"><strong>답은 하지 않을 겁니다.</strong></p>
                <p class="fragment">그냥... 생각해보세요.</p>
            </section>

            <!-- Question 1 -->
            <section class="question-slide">
                <h2>"홀덤은 바카라, 섯다 같은<br>도박 아닌가요?"</h2>
            </section>

            <!-- Question 2 -->
            <section class="question-slide">
                <h2>"돈 걸고 확률에 맡기는 게임은<br>다 위험하지 않나요?"</h2>
            </section>

            <!-- Question 3 -->
            <section class="question-slide">
                <h2>"홀덤 프로선수는<br>도박중독자 아닌가요?"</h2>
            </section>

            <!-- Transition -->
            <section>
                <p>이 질문들에 대한 답은...</p>
                <p class="fragment">나중에 여러분이 직접 찾으시길 바랍니다.</p>
                <p class="fragment" style="margin-top: 2em;">지금부터는, <span class="emphasize">홀덤이 정확히 무엇인지</span>부터 시작하겠습니다.</p>
            </section>
"""

# 너무 길어서 여기서 메인 함수로 생성
def main():
    with open('/home/jeuk/jeukoh/holdem-introduction-presentation-with-ai/index.html', 'w', encoding='utf-8') as f:
        f.write(html_header)
        f.write(act1_slides())
        # Act 2-5는 너무 길어서 여기서는 간략화
        f.write("""
            <section class="section-title">
                <h1>프레젠테이션 생성 중...</h1>
                <p>스크립트 기반으로 전체 슬라이드를 생성하고 있습니다.</p>
                <p><small>scripts/generate_full_presentation.py를 참고하세요</small></p>
            </section>
        """)
        f.write(html_footer)

    print("✅ index.html 생성 완료!")
    print("📝 전체 슬라이드를 추가하려면 스크립트를 확장하세요.")

if __name__ == '__main__':
    main()
