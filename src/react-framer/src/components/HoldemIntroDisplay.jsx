import { motion } from 'framer-motion';
import { useCardBundle } from '../hooks/useCardBundle';

// ===========================================
// HOLDEM INTRO DISPLAY - 7장 중 5장 설명 (Slide 2.1.3)
// ===========================================

// 예시 카드들 - 드라마틱한 시나리오
// 나: 포카드 (TTTT + A)
// 상대: 로얄 스트레이트 플러시 (반전!)
const MY_CARDS = ['TC', 'TD'];  // 내 홀카드: T♣ T♦
const OPPONENT_CARDS = ['KS', '7H'];  // 상대 카드: K♠ 7♥
const COMMUNITY_CARDS = ['TS', 'JS', 'QS', 'AS', 'TH'];  // 공용: T♠ J♠ Q♠ A♠ T♥

// 내 최강 5장: TC TD TS TH AS (포카드)
const MY_BEST_FIVE = ['TC', 'TD', 'TS', 'TH', 'AS'];
// 상대 최강 5장: TS JS QS KS AS (로얄 스트레이트 플러시)
const OPPONENT_BEST_FIVE = ['TS', 'JS', 'QS', 'KS', 'AS'];

// 카드 컴포넌트 - 단순 페이드 애니메이션
function Card({ cardId, isRevealed = false, isHighlighted = false, delay = 0, cards }) {
    // 앞면일 때만 카드 번들 사용, 뒷면은 인라인 SVG
    const svgContent = isRevealed ? cards?.[cardId] : null;

    return (
        <motion.div
            style={{
                width: 60,
                height: 84,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: isHighlighted
                    ? '0 0 10px 2px rgba(255, 200, 0, 0.5)'
                    : '2px 2px 8px rgba(0,0,0,0.3)',
                border: isHighlighted ? '2px solid rgba(255, 200, 0, 0.7)' : 'none',
                flexShrink: 0,
            }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
                delay,
                duration: 0.3,
            }}
        >
            {isRevealed && svgContent ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: svgContent
                            .replace(/width="2\.5in"/, 'width="100%"')
                            .replace(/height="3\.5in"/, 'height="100%"')
                    }}
                    style={{ width: '100%', height: '100%' }}
                />
            ) : (
                // 카드 뒷면 - 인라인 SVG (패턴 스케일링 문제 회피)
                <svg viewBox="-120 -168 240 336" style={{ width: '100%', height: '100%' }}>
                    <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" fill="white" stroke="black" />
                    <rect width="216" height="312" x="-108" y="-156" rx="8" fill="#b22222" />
                    <rect width="196" height="292" x="-98" y="-146" rx="4" fill="none" stroke="white" strokeWidth="2" />
                </svg>
            )}
        </motion.div>
    );
}

// 카드 뒷면 (SVG fallback)
function CardBack({ delay = 0, isHighlighted = false }) {
    return (
        <motion.div
            style={{
                width: 60,
                height: 84,
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: isHighlighted
                    ? '0 0 10px 2px rgba(255, 200, 0, 0.5)'
                    : '2px 2px 8px rgba(0,0,0,0.3)',
                border: isHighlighted ? '2px solid rgba(255, 200, 0, 0.7)' : 'none',
                flexShrink: 0,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.3 }}
        >
            <svg viewBox="-120 -168 240 336" style={{ width: '100%', height: '100%' }}>
                <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" fill="white" stroke="black" />
                <rect width="216" height="312" x="-108" y="-156" rx="8" fill="#b22222" />
                <rect width="196" height="292" x="-98" y="-146" rx="4" fill="none" stroke="white" strokeWidth="2" />
            </svg>
        </motion.div>
    );
}

// 플레이어 핸드 (2장)
function PlayerHand({ label, cards: cardIds, isRevealed, delay = 0, cardsBundle }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
                color: '#888',
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4,
            }}>
                {label}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
                {cardIds.map((cardId, i) => (
                    <Card
                        key={i}
                        cardId={cardId}
                        isRevealed={isRevealed && cardId !== 'back'}
                        delay={delay + i * 0.1}
                        cards={cardsBundle}
                    />
                ))}
            </div>
        </div>
    );
}

// 공용 카드 (5장)
function CommunityCards({ revealCount = 0, isHighlighted = false, delay = 0, cards }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <motion.div
                style={{
                    color: isHighlighted ? '#ffc800' : '#888',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 4,
                }}
                animate={{
                    scale: isHighlighted ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
            >
                공용 카드
            </motion.div>
            <div style={{ display: 'flex', gap: 6 }}>
                {COMMUNITY_CARDS.map((cardId, i) => (
                    <Card
                        key={i}
                        cardId={cardId}
                        isRevealed={i < revealCount}
                        isHighlighted={isHighlighted && i < revealCount}
                        delay={delay + i * 0.1}
                        cards={cards}
                    />
                ))}
            </div>
        </div>
    );
}

// 메인 컴포넌트
export default function HoldemIntroDisplay({ step = 0 }) {
    const cards = useCardBundle();

    // step별 상태:
    // 0: 모두 뒷면
    // 1: 내 2장 공개 (TC, TD)
    // 2: 플랍 (TS, JS, QS)
    // 3: 턴 (AS)
    // 4: 리버 (TH)
    // 5: 내 최강 5장 하이라이트 (포카드: TC TD TS TH + AS)
    // 6: 상대 공개 + 로얄플러시 하이라이트 (반전!)

    const myCardsRevealed = step >= 1;
    const communityRevealCount = step >= 4 ? 5 : step >= 3 ? 4 : step >= 2 ? 3 : 0;
    const opponentRevealed = step >= 6;

    // 하이라이트 로직
    const myHighlightCards = step === 5 ? MY_BEST_FIVE : (step === 6 ? [] : []);
    const opponentHighlightCards = step === 6 ? OPPONENT_BEST_FIVE : [];
    const communityHighlightCards = step === 5 ? MY_BEST_FIVE : (step === 6 ? OPPONENT_BEST_FIVE : []);

    // 족보 텍스트
    const showMyHand = step === 5;
    const showOpponentHand = step === 6;

    if (!cards) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                color: '#888'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        }}>
            {/* 컨텐츠 래퍼 - 점선 오버레이 기준 */}
            <div style={{ position: 'relative' }}>
                {/* 상대 7장 묶음 점선 오버레이 (position: absolute) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: -20,
                    right: -20,
                    bottom: '33%', // 공용 카드까지
                    border: '2px dashed',
                    borderColor: showOpponentHand ? 'rgba(255, 107, 107, 0.5)' : 'transparent',
                    borderRadius: 12,
                    pointerEvents: 'none',
                    transition: 'border-color 0.3s ease',
                    zIndex: 10,
                }}>
                    {/* 7장 중 최강 5장 라벨 */}
                    <div style={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#1a1a1a',
                        padding: '2px 10px',
                        fontSize: 11,
                        color: '#ff6b6b',
                        borderRadius: 4,
                        opacity: showOpponentHand ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}>
                        7장 중 최강 5장
                    </div>
                </div>

                {/* 내 7장 묶음 점선 오버레이 (position: absolute) */}
                <div style={{
                    position: 'absolute',
                    top: '33%', // 공용 카드부터
                    left: -20,
                    right: -20,
                    bottom: 0,
                    border: '2px dashed',
                    borderColor: showMyHand ? 'rgba(78, 205, 196, 0.5)' : 'transparent',
                    borderRadius: 12,
                    pointerEvents: 'none',
                    transition: 'border-color 0.3s ease',
                    zIndex: 10,
                }}>
                    {/* 7장 중 최강 5장 라벨 */}
                    <div style={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#1a1a1a',
                        padding: '2px 10px',
                        fontSize: 11,
                        color: '#4ecdc4',
                        borderRadius: 4,
                        opacity: showMyHand ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}>
                        7장 중 최강 5장
                    </div>
                </div>

                {/* 상대 영역 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 16,
                }}>
                    <div style={{
                        color: opponentRevealed ? '#ff6b6b' : '#888',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 8,
                    }}>
                        상대
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {OPPONENT_CARDS.map((cardId, i) => (
                            <Card
                                key={i}
                                cardId={cardId}
                                isRevealed={opponentRevealed}
                                isHighlighted={opponentHighlightCards.includes(cardId)}
                                delay={i * 0.1}
                                cards={cards}
                            />
                        ))}
                    </div>
                    {/* 로열 스트레이트 플러시 텍스트 - 높이 예약 */}
                    <div style={{ height: 24, marginTop: 8 }}>
                        {showOpponentHand && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    color: '#ff6b6b',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}
                            >
                                로열 스트레이트 플러시!
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* 공용 카드 영역 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 16,
                }}>
                    <div style={{
                        color: '#888',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 8,
                    }}>
                        공용 카드
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {COMMUNITY_CARDS.map((cardId, i) => (
                            <Card
                                key={i}
                                cardId={cardId}
                                isRevealed={i < communityRevealCount}
                                isHighlighted={communityHighlightCards.includes(cardId)}
                                delay={0.2 + i * 0.1}
                                cards={cards}
                            />
                        ))}
                    </div>
                </div>

                {/* 내 영역 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div style={{
                        color: showMyHand ? '#4ecdc4' : '#888',
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginBottom: 8,
                    }}>
                        나
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {MY_CARDS.map((cardId, i) => (
                            <Card
                                key={i}
                                cardId={cardId}
                                isRevealed={myCardsRevealed}
                                isHighlighted={myHighlightCards.includes(cardId)}
                                delay={0.1 + i * 0.1}
                                cards={cards}
                            />
                        ))}
                    </div>
                    {/* 포카드 텍스트 - 높이 예약 */}
                    <div style={{ height: 24, marginTop: 8 }}>
                        {showMyHand && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    color: '#4ecdc4',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}
                            >
                                포카드!
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
