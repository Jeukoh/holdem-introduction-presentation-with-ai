import { motion } from 'framer-motion';

// ===========================================
// DECK DISPLAY - 52 Cards Animation (Slide 2.1.1)
// ===========================================

// 고정 스케일 - Reveal.js 960x700 슬라이드 기준 최적화
// 0.85 * 1.5 ≈ 1.27
const FIXED_SCALE = 1.27;

// 무늬 데이터: symbol ID와 색상
const SUIT_DATA = {
    S: { symbol: 'SS', color: 'black' },
    H: { symbol: 'SH', color: 'red' },
    D: { symbol: 'SD', color: 'red' },
    C: { symbol: 'SC', color: 'black' },
};

const SUITS = ['S', 'H', 'D', 'C']; // Spade, Heart, Diamond, Club
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']; // T = 10

// 스프라이트는 HTML에 인라인으로 포함됨 (index.html 참조)
// 공유 심볼(SS, SH, SD, SC, VA-VK)을 조합하여 카드 렌더링

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

    // Step 7: A열 하이라이트
    if (step === 7) {
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

// CardFace: 카드 앞면을 공유 심볼로 조합하여 렌더링
function CardFace({ rankSymbol, suitSymbol, color }) {
    return (
        <g style={{ color }}>
            {/* 카드 배경 */}
            <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" fill="white" stroke="#999" />
            {/* 왼쪽 상단: 랭크 */}
            <use href={`#${rankSymbol}`} width="32" height="32" x="-114.4" y="-156" />
            {/* 왼쪽 상단: 작은 무늬 */}
            <use href={`#${suitSymbol}`} width="26.769" height="26.769" x="-111.784" y="-119" />
            {/* 중앙: 큰 무늬 */}
            <use href={`#${suitSymbol}`} width="70" height="70" x="-35" y="-35" />
            {/* 오른쪽 하단 (180도 회전) */}
            <g transform="rotate(180)">
                <use href={`#${rankSymbol}`} width="32" height="32" x="-114.4" y="-156" />
                <use href={`#${suitSymbol}`} width="26.769" height="26.769" x="-111.784" y="-119" />
            </g>
        </g>
    );
}

function DeckCard({ rank, suit, suitIndex, rankIndex, step, scale }) {
    const layout = getCardLayout(step, suitIndex, rankIndex, scale);
    const delay = getAnimationDelay(step, suitIndex, rankIndex);

    // 공유 심볼 ID
    const suitInfo = SUIT_DATA[suit];
    const rankSymbol = `V${rank}`;
    const suitSymbol = suitInfo.symbol;
    const color = suitInfo.color;

    // 카드 크기 (2.5:3.5 비율, viewport 스케일 적용)
    const baseCardWidth = 50;
    const baseCardHeight = 70; // 50 * 3.5 / 2.5 = 70
    const cardWidth = baseCardWidth * scale;
    const cardHeight = baseCardHeight * scale;

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
                filter: layout.filter,
            }}
            transition={{
                delay,
                duration: 0.4,
                type: 'spring',
                stiffness: 100,
                damping: 15,
            }}
        >
            <svg
                viewBox="-120 -168 240 336"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%' }}
            >
                <CardFace rankSymbol={rankSymbol} suitSymbol={suitSymbol} color={color} />
            </svg>
        </motion.div>
    );
}

export default function DeckDisplay({ step = 0 }) {
    // 고정 스케일 사용 - Reveal.js가 슬라이드 전체를 스케일링
    const scale = FIXED_SCALE;

    // 그리드 전체 크기 (13열 x 4행, viewport 스케일 적용)
    const gridWidth = 13 * 55 * scale;
    const gridHeight = 4 * 78 * scale;

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
                />
            ))}
        </div>
    );
}
