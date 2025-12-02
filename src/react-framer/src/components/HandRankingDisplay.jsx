import { motion, AnimatePresence } from 'framer-motion';
import { useCardBundle } from '../hooks/useCardBundle';

// ===========================================
// HAND RANKING DISPLAY - Poker Hands Education (Slide 2.1.2)
// ===========================================

// 고정 스케일 - Reveal.js 960x700 슬라이드 기준
// 카드 랭크 가시성을 위해 1.3으로 설정
const FIXED_SCALE = 1.3;

// 카드 ID 변환: "As" → "AS", "Kh" → "KH"
function cardStrToSymbolId(cardStr) {
    const rank = cardStr[0].toUpperCase();
    const suit = cardStr[1].toUpperCase();
    return `${rank}${suit}`;
}

// 핸드 랭킹 데이터 (강→약) - 확률 출처: 5장 드로우 기준 (2,598,960 조합)
// 각 족보별 3개 예시: 강한 예시 → 약한 예시 → 특수 케이스/무승부
const HAND_RANKINGS = [
    {
        name: 'Royal Flush',
        nameKr: '로열 플러시',
        description: '같은 무늬 A-K-Q-J-10',
        count: 4,
        probability: '0.00015%',
        examples: [
            { cards: ['As', 'Ks', 'Qs', 'Js', 'Ts'], note: '스페이드 로열' },
            { cards: ['Ah', 'Kh', 'Qh', 'Jh', 'Th'], note: '하트 로열' },
            { cards: ['Ad', 'Kd', 'Qd', 'Jd', 'Td'], note: '무늬 달라도 동점!' },
        ],
    },
    {
        name: 'Straight Flush',
        nameKr: '스트레이트 플러시',
        description: '같은 무늬 연속 5장',
        count: 36,
        probability: '0.0014%',
        examples: [
            { cards: ['Kh', 'Qh', 'Jh', 'Th', '9h'], note: '킹하이 (로열 다음)' },
            { cards: ['6d', '5d', '4d', '3d', '2d'], note: '식스하이' },
            { cards: ['5c', '4c', '3c', '2c', 'Ac'], note: '휠 (A=1, 최약)' },
        ],
    },
    {
        name: 'Four of a Kind',
        nameKr: '포카드',
        description: '같은 숫자 4장 + 1장',
        count: 624,
        probability: '0.024%',
        examples: [
            { cards: ['As', 'Ah', 'Ad', 'Ac', 'Ks'], note: '에이스 포카드 (최강)' },
            { cards: ['Ks', 'Kh', 'Kd', 'Kc', 'As'], note: '킹 포카드' },
            { cards: ['2s', '2h', '2d', '2c', 'As'], note: '투 포카드 (최약)' },
        ],
    },
    {
        name: 'Full House',
        nameKr: '풀하우스',
        description: '트리플 + 페어',
        count: 3744,
        probability: '0.14%',
        examples: [
            { cards: ['As', 'Ah', 'Ad', 'Ks', 'Kh'], note: 'AAA KK (트리플이 기준!)' },
            { cards: ['As', 'Ah', 'Ad', '2s', '2h'], note: 'AAA 22 (↑와 동급)' },
            { cards: ['Ks', 'Kh', 'Kd', 'As', 'Ah'], note: 'KKK AA (↑보다 약함!)' },
        ],
    },
    {
        name: 'Flush',
        nameKr: '플러시',
        description: '같은 무늬 5장',
        count: 5108,
        probability: '0.20%',
        examples: [
            { cards: ['As', 'Ks', 'Qs', 'Js', '9s'], note: '에이스 하이 플러시' },
            { cards: ['As', 'Ks', 'Qs', 'Js', '8s'], note: '↑와 5번째 카드로 비교' },
            { cards: ['Kh', 'Qh', 'Jh', 'Th', '8h'], note: '킹 하이 (A없으면 약함)' },
        ],
    },
    {
        name: 'Straight',
        nameKr: '스트레이트',
        description: '연속 숫자 5장',
        count: 10200,
        probability: '0.39%',
        examples: [
            { cards: ['As', 'Kh', 'Qd', 'Jc', 'Ts'], note: '브로드웨이 (최강)' },
            { cards: ['Kh', 'Qd', 'Jc', 'Ts', '9s'], note: '킹하이 스트레이트' },
            { cards: ['5s', '4h', '3d', '2c', 'As'], note: '휠 (A=1로 사용, 최약)' },
        ],
    },
    {
        name: 'Three of a Kind',
        nameKr: '트리플',
        description: '같은 숫자 3장',
        count: 54912,
        probability: '2.1%',
        examples: [
            { cards: ['As', 'Ah', 'Ad', 'Ks', 'Qh'], note: '트리플 에이스' },
            { cards: ['Ks', 'Kh', 'Kd', 'As', 'Qh'], note: '트리플 킹' },
            { cards: ['2s', '2h', '2d', 'As', 'Kh'], note: '트리플 투 (키커 비교)' },
        ],
    },
    {
        name: 'Two Pair',
        nameKr: '투페어',
        description: '페어 2개',
        count: 123552,
        probability: '4.8%',
        examples: [
            { cards: ['As', 'Ah', 'Ks', 'Kh', 'Qd'], note: 'AA KK (탑페어 기준)' },
            { cards: ['As', 'Ah', 'Qs', 'Qh', 'Kd'], note: 'AA QQ (↑보다 약함)' },
            { cards: ['Ks', 'Kh', 'Qs', 'Qh', 'Ad'], note: 'KK QQ (A페어 없어서 약함)' },
        ],
    },
    {
        name: 'One Pair',
        nameKr: '원페어',
        description: '같은 숫자 2장',
        count: 1098240,
        probability: '42%',
        examples: [
            { cards: ['As', 'Ah', 'Ks', 'Qh', 'Jd'], note: 'AA + K Q J 키커' },
            { cards: ['As', 'Ah', 'Ks', 'Qh', 'Td'], note: 'AA + K Q T (↑보다 약함)' },
            { cards: ['Ks', 'Kh', 'As', 'Qh', 'Jd'], note: 'KK (A페어보다 약함)' },
        ],
    },
    {
        name: 'High Card',
        nameKr: '하이카드',
        description: '족보 없음',
        count: 1302540,
        probability: '50%',
        examples: [
            { cards: ['As', 'Kh', 'Qd', 'Jc', '9s'], note: 'A K Q J 9 하이' },
            { cards: ['As', 'Kh', 'Qd', 'Jc', '8s'], note: 'A K Q J 8 (↑보다 약함)' },
            { cards: ['Ks', 'Qh', 'Jd', 'Tc', '8s'], note: 'K하이 (A없으면 약함)' },
        ],
    },
];

// 총 스텝 수 계산 (각 핸드의 모든 예시)
const TOTAL_STEPS = HAND_RANKINGS.reduce((sum, hand) => sum + hand.examples.length, 0);

// step → (handIndex, exampleIndex) 매핑
function getHandAndExampleIndex(step) {
    let remaining = step;
    for (let handIdx = 0; handIdx < HAND_RANKINGS.length; handIdx++) {
        const exampleCount = HAND_RANKINGS[handIdx].examples.length;
        if (remaining < exampleCount) {
            return { handIndex: handIdx, exampleIndex: remaining };
        }
        remaining -= exampleCount;
    }
    // 마지막 핸드의 마지막 예시
    const lastHand = HAND_RANKINGS.length - 1;
    return { handIndex: lastHand, exampleIndex: HAND_RANKINGS[lastHand].examples.length - 1 };
}

// 미니 카드 컴포넌트 (JSON 번들 사용)
function MiniCard({ cardStr, index, scale, shouldAnimate = true, cards }) {
    const symbolId = cardStrToSymbolId(cardStr);

    // 카드 크기 (2.5:3.5 비율)
    const cardWidth = 50 * scale;
    const cardHeight = 70 * scale;

    return (
        <motion.div
            initial={shouldAnimate ? { opacity: 0, y: -20, rotateY: 180 } : false}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={shouldAnimate ? {
                delay: index * 0.1,
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 20,
            } : { duration: 0 }}
            style={{
                width: cardWidth,
                height: cardHeight,
                borderRadius: 4 * scale,
                overflow: 'hidden',
                boxShadow: `1px 1px 4px rgba(0,0,0,0.3)`,
                flexShrink: 0,
            }}
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: cards?.[symbolId]
                        ?.replace(/width="2\.5in"/, 'width="100%"')
                        .replace(/height="3\.5in"/, 'height="100%"')
                        || ''
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </motion.div>
    );
}

// 핸드 리스트 아이템
function HandListItem({ hand, isActive, isPassed, scale }) {
    // 경우의 수 포맷팅 (1000 이상이면 콤마 추가)
    const formatCount = (n) => n.toLocaleString();

    return (
        <motion.div
            animate={{
                backgroundColor: isActive ? '#f1c40f' : isPassed ? '#27ae60' : '#2c3e50',
                color: isActive ? '#000' : '#fff',
                scale: isActive ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{
                padding: `${3 * scale}px ${8 * scale}px`,
                borderRadius: 4 * scale,
                marginBottom: 2 * scale,
                display: 'flex',
                alignItems: 'center',
                gap: 4 * scale,
            }}
        >
            {/* 족보명 */}
            <span style={{
                fontSize: 11 * scale,
                fontWeight: 'bold',
                minWidth: 100 * scale,
            }}>
                {hand.name}
            </span>
            {/* 설명 */}
            <span style={{
                fontSize: 9 * scale,
                opacity: 0.7,
                minWidth: 80 * scale,
            }}>
                {hand.description}
            </span>
            {/* 경우의 수 */}
            <span style={{
                fontSize: 9 * scale,
                opacity: 0.6,
                minWidth: 55 * scale,
                textAlign: 'right',
                fontFamily: 'monospace',
            }}>
                {formatCount(hand.count)}
            </span>
            {/* 확률 */}
            <span style={{
                fontSize: 9 * scale,
                opacity: 0.6,
                minWidth: 45 * scale,
                textAlign: 'right',
            }}>
                {hand.probability}
            </span>
        </motion.div>
    );
}

// 단일 예시 행 (카드만, 텍스트 없음)
function ExampleRow({ example, exampleIdx, handName, scale, isNew, cards }) {
    return (
        <motion.div
            initial={isNew ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={isNew ? { duration: 0.3 } : { duration: 0 }}
            style={{
                display: 'flex',
                gap: 4 * scale,
            }}
        >
            {example.cards.map((card, i) => (
                <MiniCard
                    key={`${handName}-${exampleIdx}-${card}`}
                    cardStr={card}
                    index={i}
                    scale={scale * 0.85}
                    shouldAnimate={isNew}
                    cards={cards}
                />
            ))}
        </motion.div>
    );
}

// 예시 카드만 표시 (제목은 부모에서 표시)
function ExampleCardsOnly({ hand, exampleIndex, scale, cards }) {
    if (exampleIndex < 0) return null;

    // exampleIndex까지의 모든 예시를 누적해서 보여줌
    const visibleExamples = hand.examples.slice(0, exampleIndex + 1);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18 * scale,  // 왼쪽 테이블 행간과 맞춤
            alignItems: 'flex-start',
        }}>
            {visibleExamples.map((example, idx) => (
                <ExampleRow
                    key={`${hand.name}-row-${idx}`}
                    example={example}
                    exampleIdx={idx}
                    handName={hand.name}
                    scale={scale}
                    isNew={idx === exampleIndex}
                    cards={cards}
                />
            ))}
        </div>
    );
}

export default function HandRankingDisplay({ step = 0 }) {
    const scale = FIXED_SCALE;
    const cards = useCardBundle();

    // 현재 step → (handIndex, exampleIndex) 변환
    const { handIndex: currentHandIndex, exampleIndex: currentExampleIndex } = getHandAndExampleIndex(step);
    const currentHand = HAND_RANKINGS[currentHandIndex];

    // 카드 번들 로딩 중
    if (!cards) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#888' }}>
                Loading cards...
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                gap: 40 * scale,
                padding: 20 * scale,
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            {/* 왼쪽: 핸드 리스트 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 280 * scale,
            }}>
                <div style={{
                    fontSize: 18 * scale,
                    fontWeight: 'bold',
                    color: '#f1c40f',
                    marginBottom: 12 * scale,
                    textAlign: 'center',
                }}>
                    POKER HAND RANKINGS
                </div>
                <div style={{
                    fontSize: 10 * scale,
                    color: '#7f8c8d',
                    marginBottom: 8 * scale,
                    textAlign: 'center',
                }}>
                    ↑ 강 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 약 ↓
                </div>
                {HAND_RANKINGS.map((hand, index) => (
                    <HandListItem
                        key={hand.name}
                        hand={hand}
                        isActive={index === currentHandIndex}
                        isPassed={index < currentHandIndex}
                        scale={scale}
                    />
                ))}
            </div>

            {/* 오른쪽: 예시 카드 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minWidth: 350 * scale,
            }}>
                {/* 핸드 이름 - 왼쪽 POKER HAND RANKINGS와 높이 맞춤 */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`title-${currentHand.name}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            fontSize: 18 * scale,
                            fontWeight: 'bold',
                            color: '#f1c40f',
                            marginBottom: 12 * scale,
                        }}
                    >
                        {currentHand.name}
                    </motion.div>
                </AnimatePresence>
                {/* 강약 표시 텍스트 공간 (왼쪽과 맞추기 위한 spacer) */}
                <div style={{
                    fontSize: 10 * scale,
                    color: '#7f8c8d',
                    marginBottom: 8 * scale,
                }}>
                    &nbsp;
                </div>
                {/* 예시 카드들 */}
                <AnimatePresence mode="wait">
                    {step >= 0 && (
                        <motion.div
                            key={`cards-${currentHandIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ExampleCardsOnly
                                hand={currentHand}
                                exampleIndex={currentExampleIndex}
                                scale={scale}
                                cards={cards}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Export total steps for engine
export const HAND_RANKING_TOTAL_STEPS = TOTAL_STEPS;
