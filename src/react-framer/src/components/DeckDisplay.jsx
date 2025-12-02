import { motion } from 'framer-motion';
import { useCardBundle } from '../hooks/useCardBundle';

// ===========================================
// DECK DISPLAY - 52 Cards Animation (Slide 2.1.1)
// ===========================================

// 고정 스케일 - Reveal.js 960x700 슬라이드 기준 최적화
// 0.85 * 1.5 ≈ 1.27
const FIXED_SCALE = 1.27;

const SUITS = ['S', 'H', 'D', 'C']; // Spade, Heart, Diamond, Club
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']; // T = 10

// 개별 SVG 파일 사용 (img 태그로 로드)
// cards-new/*.svg: 완전한 카드 이미지 (AS.svg, KH.svg, TD.svg 등)

// 52장 카드 데이터 생성
const ALL_CARDS = SUITS.flatMap((suit, suitIndex) =>
    RANKS.map((rank, rankIndex) => ({
        rank,
        suit,
        suitIndex,
        rankIndex,
        id: `${rank}${suit}`,
    }))
);

// Step별 레이아웃 계산 (중앙 기준 좌표)
function getCardLayout(step, suitIndex, rankIndex, scale = 1) {
    const baseColGap = 55;  // 카드 너비(50) + 간격(5)
    const baseRowGap = 78;  // 카드 높이(70) + 간격(8)
    const colGap = baseColGap * scale;
    const rowGap = baseRowGap * scale;

    // 그리드 중앙 오프셋 (13열 x 4행 기준)
    const centerOffsetX = -(13 * colGap) / 2 + colGap / 2;
    const centerOffsetY = -(4 * rowGap) / 2 + rowGap / 2;

    // Step 0: 덱 뭉치 (겹침)
    if (step === 0) {
        const offset = suitIndex * 13 + rankIndex;
        return {
            x: (offset * 1.8 - 50) * scale,
            y: (offset * 1.0 - 25) * scale,
            opacity: 1,
            filter: 'none',
        };
    }

    // Step 1: 행 분리 (무늬별), 열은 겹침
    if (step === 1) {
        const colOffset = (rankIndex * 4 - 25) * scale;
        return {
            x: colOffset,
            y: centerOffsetY + suitIndex * rowGap,
            opacity: 1,
            filter: 'none',
        };
    }

    // Step 2-5: 무늬별 하이라이트 (행 분리 유지)
    if (step >= 2 && step <= 5) {
        const highlightSuit = step - 2; // 0=S, 1=H, 2=D, 3=C
        const colOffset = (rankIndex * 4 - 25) * scale;
        const isHighlighted = suitIndex === highlightSuit;
        return {
            x: colOffset,
            y: centerOffsetY + suitIndex * rowGap,
            opacity: 1,
            filter: isHighlighted ? 'none' : 'grayscale(100%) brightness(0.6)',
        };
    }

    // Step 6: 전체 펼침 (4x13 그리드)
    if (step === 6) {
        return {
            x: centerOffsetX + rankIndex * colGap,
            y: centerOffsetY + suitIndex * rowGap,
            opacity: 1,
            filter: 'none',
        };
    }

    // Step 7: 파도타기 애니메이션 (A→2→3→...→K 순서로 하이라이트)
    // rankIndex: 0=A, 1=2, 2=3, ..., 12=K
    // A부터 시작해서 K까지
    if (step === 7) {
        return {
            x: centerOffsetX + rankIndex * colGap,
            y: centerOffsetY + suitIndex * rowGap,
            opacity: 1,
            filter: 'none',
            // waveOrder는 rankIndex 그대로 (A=0, 2=1, ..., K=12)
            waveOrder: rankIndex,
        };
    }

    // Step 8: A열 하이라이트
    if (step === 8) {
        const isAce = rankIndex === 0;
        return {
            x: centerOffsetX + rankIndex * colGap,
            y: centerOffsetY + suitIndex * rowGap,
            opacity: 1,
            filter: isAce ? 'none' : 'grayscale(100%) brightness(0.6)',
        };
    }

    // Default
    return { x: 0, y: 0, opacity: 1, filter: 'none' };
}

// 파도 효과용 딜레이 계산
function getAnimationDelay(step, suitIndex, rankIndex) {
    if (step === 6) {
        // A→K 순서로 파도
        return rankIndex * 0.05;
    }
    return 0;
}

function DeckCard({ rank, suit, suitIndex, rankIndex, step, scale, cards }) {
    const layout = getCardLayout(step, suitIndex, rankIndex, scale);
    const delay = getAnimationDelay(step, suitIndex, rankIndex);

    // 카드 심볼 ID (cards-new-sprite.svg)
    const cardSymbolId = `${rank}${suit}`; // AS, KH, TD 등

    // 카드 크기 (2.5:3.5 비율, viewport 스케일 적용)
    const baseCardWidth = 50;
    const baseCardHeight = 70; // 50 * 3.5 / 2.5 = 70
    const cardWidth = baseCardWidth * scale;
    const cardHeight = baseCardHeight * scale;

    // Step 7: 파도타기 애니메이션 (A→K, 이전 열은 꺼짐)
    const isWaveStep = step === 7;
    const waveOrder = layout.waveOrder || 0;
    const waveInterval = 0.15; // 각 열 사이 간격
    const highlightDuration = 0.25; // 하이라이트 지속 시간
    const totalWaveTime = 13 * waveInterval + highlightDuration; // 전체 애니메이션 시간

    // 파도타기: dim → bright → dim 타이밍 계산
    const myStartTime = waveOrder * waveInterval;
    const myEndTime = myStartTime + highlightDuration;

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                borderRadius: 3 * scale,
                overflow: 'hidden',
                boxShadow: `${1 * scale}px ${1 * scale}px ${4 * scale}px rgba(0,0,0,0.3)`,
                backgroundColor: 'white',
            }}
            animate={{
                x: layout.x,
                y: layout.y,
                opacity: layout.opacity,
                filter: isWaveStep ? [
                    'grayscale(100%) brightness(0.5)',  // 시작: 어둡게
                    'grayscale(0%) brightness(1.3)',    // 켜짐
                    'grayscale(100%) brightness(0.5)',  // 다시 어둡게
                ] : layout.filter,
                scale: isWaveStep ? [1, 1.1, 1] : 1,
            }}
            transition={isWaveStep ? {
                delay: myStartTime,
                duration: highlightDuration,
                times: [0, 0.4, 1],
                ease: 'easeOut',
            } : {
                delay,
                duration: 0.4,
                type: 'spring',
                stiffness: 100,
                damping: 15,
            }}
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: cards?.[cardSymbolId]
                        ?.replace(/width="2\.5in"/, 'width="100%"')
                        .replace(/height="3\.5in"/, 'height="100%"')
                        || ''
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </motion.div>
    );
}

export default function DeckDisplay({ step = 0 }) {
    // 고정 스케일 사용 - Reveal.js가 슬라이드 전체를 스케일링
    const scale = FIXED_SCALE;
    const cards = useCardBundle();

    // 그리드 전체 크기 (13열 x 4행, viewport 스케일 적용)
    const gridWidth = 13 * 55 * scale;
    const gridHeight = 4 * 78 * scale;

    // 카드 번들 로딩 중
    if (!cards) {
        return (
            <div style={{ width: gridWidth, height: gridHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                Loading cards...
            </div>
        );
    }

    // 자연스러운 크기 - 부모 flexbox가 중앙 정렬 담당
    return (
        <div
            style={{
                position: 'relative',
                width: gridWidth,
                height: gridHeight,
            }}
        >
            {ALL_CARDS.map((card) => (
                <DeckCard
                    key={card.id}
                    rank={card.rank}
                    suit={card.suit}
                    suitIndex={card.suitIndex}
                    rankIndex={card.rankIndex}
                    step={step}
                    scale={scale}
                    cards={cards}
                />
            ))}
        </div>
    );
}
