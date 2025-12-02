import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardBundle } from '../hooks/useCardBundle';
import PositionInfoModal from './PositionInfoModal';
import ActionInfoModal from './ActionInfoModal';
import EquityModal from './EquityModal';
import EVModal from './EVModal';
import ComparisonModal from './ComparisonModal';
import LessonModal from './LessonModal';
import PotOddsModal from './PotOddsModal';

// ===========================================
// FIXED LAYOUT (Reveal.js handles viewport scaling)
// ===========================================

// 고정 크기 - Reveal.js 960x700 슬라이드 기준 최적화
const FIXED_TABLE_WIDTH = 620;
const FIXED_SCALE = 1;

// ===========================================
// CONSTANTS
// ===========================================

// 6-handed table positions (percentages relative to table)
// chips are now in BB units (100BB = standard starting stack)
const playerPositions = [
    { id: 1, position: 'CO', name: 'CO', chips: 100, dealOrder: 5, layoutPosition: 'top',
      style: { top: 'calc(-1 * var(--player-offset-top))', left: '50%', transform: 'translateX(-50%)' } },
    { id: 2, position: 'BTN', name: 'BTN', chips: 100, dealOrder: 6, layoutPosition: 'right',
      style: { top: 'var(--player-offset-side-inner)', right: 'calc(-1 * var(--player-offset-side))' } },
    { id: 3, position: 'SB', name: 'SB', chips: 100, dealOrder: 1, layoutPosition: 'right',
      style: { bottom: 'var(--player-offset-side-inner)', right: 'calc(-1 * var(--player-offset-side))' } },
    { id: 4, position: 'BB', name: 'YOU (BB)', chips: 100, dealOrder: 2, isYou: true, layoutPosition: 'bottom',
      style: { bottom: 'calc(-1 * var(--player-offset-top))', left: '50%', transform: 'translateX(-50%)' } },
    { id: 5, position: 'UTG', name: 'UTG', chips: 100, dealOrder: 3, layoutPosition: 'left',
      style: { bottom: 'var(--player-offset-side-inner)', left: 'calc(-1 * var(--player-offset-side))' } },
    { id: 6, position: 'HJ', name: 'HJ', chips: 100, dealOrder: 4, layoutPosition: 'left',
      style: { top: 'var(--player-offset-side-inner)', left: 'calc(-1 * var(--player-offset-side))' } },
];

// SVG 에셋 색상과 일치 (assets/positions/*.svg 참조)
const positionColors = {
    BTN: '#d4a574',  // 베이지
    SB: '#3498db',   // 파란색
    BB: '#2ecc71',   // 초록색
    UTG: '#e74c3c',  // 빨간색
    HJ: '#9b59b6',   // 보라색
    CO: '#f39c12',   // 주황색
};

// ===========================================
// ASSET HELPERS
// ===========================================

// 스프라이트는 HTML에 인라인으로 포함됨 - #cardId 형태로만 참조
// 카드 ID 변환 (예: {rank: 'A', suit: '♠'} → 'AS')
const suitToCode = {
    '♥': 'H',
    '♦': 'D',
    '♣': 'C',
    '♠': 'S',
};

function getCardId(card) {
    if (!card) return null;
    const rankCode = card.rank === '10' ? 'T' : card.rank;
    const suitCode = suitToCode[card.suit] || 'S';
    return `${rankCode}${suitCode}`;
}

function getPositionIconUrl(position) {
    return `assets/positions/${position}.svg`;
}

function getDealerButtonUrl() {
    return `assets/decorative/dealer-button.svg`;
}

// ===========================================
// SUB COMPONENTS
// ===========================================

// CardContent: JSON 번들에서 카드 SVG 렌더링
function CardContent({ cardId, cards }) {
    const svgContent = cards?.[cardId];
    if (!svgContent) return null;

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: svgContent
                    .replace(/width="2\.5in"/, 'width="100%"')
                    .replace(/height="3\.5in"/, 'height="100%"')
            }}
            style={{ width: '100%', height: '100%' }}
        />
    );
}

// CardBack: 카드 뒷면 (클래식 빨간색 스타일)
function CardBack() {
    return (
        <svg viewBox="-120 -168 240 336" style={{ width: '100%', height: '100%' }}>
            <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" fill="white" stroke="black" />
            <rect width="216" height="312" x="-108" y="-156" rx="8" fill="#b22222" />
            <rect width="196" height="292" x="-98" y="-146" rx="4" fill="none" stroke="white" strokeWidth="2" />
        </svg>
    );
}

function Card({ card, dealOrder = 0, isFolded = false, isHidden = true, isWinner = false, cards }) {
    const delay = dealOrder * 0.15;
    const cardId = isHidden ? null : getCardId(card);

    return (
        <motion.div
            className={`card-wrapper ${isFolded ? 'folded' : ''} ${isWinner ? 'winner' : ''}`}
            initial={{ opacity: 0, y: -100, rotateY: 180 }}
            animate={{
                opacity: isFolded ? 0.3 : 1,
                y: 0,
                rotateY: 0,
                scale: isWinner ? 1.1 : 1,
            }}
            transition={{
                delay,
                duration: 0.4,
                type: 'spring',
                stiffness: 200
            }}
        >
            <div className="card-image" style={isWinner ? { boxShadow: '0 0 20px #f1c40f' } : {}}>
                {cardId ? (
                    <CardContent cardId={cardId} cards={cards} />
                ) : (
                    <CardBack />
                )}
            </div>
        </motion.div>
    );
}

function CommunityCard({ card, dealOrder = 0, cards }) {
    const delay = dealOrder * 0.15;
    const cardId = getCardId(card);

    return (
        <motion.div
            className="community-card-wrapper"
            initial={{ opacity: 0, y: -50, rotateY: 180 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay, duration: 0.4, type: 'spring' }}
        >
            <div className="community-card-image">
                {cardId ? (
                    <CardContent cardId={cardId} cards={cards} />
                ) : (
                    <CardBack />
                )}
            </div>
        </motion.div>
    );
}

function ActionIndicator({ action, delay }) {
    // 액션 클래스 결정 (블라인드는 'blind' 클래스 사용)
    let actionClass = action.toLowerCase();
    if (action.includes('$')) {
        actionClass = 'blind';
    }
    return (
        <motion.div
            className={`action-indicator ${actionClass}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay,
                type: 'spring',
                stiffness: 300,
                damping: 15
            }}
        >
            {action}
        </motion.div>
    );
}

// Chip stack component - shows accumulated chips in front of player during phase
function PlayerChipStack({ amount, layoutPosition, position }) {
    if (!amount || amount <= 0) return null;

    // 칩 스택 위치 (테이블 중앙 방향으로, 카드와 겹치지 않게)
    // BB/CO는 카드와 분리하기 위해 오프셋 조정
    const getChipPosition = () => {
        switch (layoutPosition) {
            case 'top':
                // CO: 칩을 살짝 왼쪽으로 (카드는 오른쪽에 있음)
                return { top: 'calc(100% + 50px)', left: 'calc(50% - 40px)', transform: 'translateX(-50%)' };
            case 'bottom':
                // BB: 칩을 오른쪽으로 (카드는 왼쪽에 있음)
                return { bottom: 'calc(100% + 50px)', left: 'calc(50% + 40px)', transform: 'translateX(-50%)' };
            case 'left': return { left: 'calc(100% + 80px)', top: '50%', transform: 'translateY(-50%)' };
            case 'right': return { right: 'calc(100% + 80px)', top: '50%', transform: 'translateY(-50%)' };
            default: return {};
        }
    };

    // 칩 개수 결정 (BB 기준, 1~5개)
    const chipCount = Math.min(5, Math.max(1, Math.ceil(amount / 5)));

    return (
        <motion.div
            className="player-chip-stack"
            style={{
                position: 'absolute',
                ...getChipPosition(),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: layoutPosition === 'top' ? 50 : layoutPosition === 'bottom' ? -50 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="chip-stack" style={{ display: 'flex', flexDirection: 'column-reverse', marginBottom: 4 }}>
                {[...Array(chipCount)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="chip red"
                        style={{
                            width: 20,
                            height: 6,
                            background: 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)',
                            borderRadius: 3,
                            marginTop: i > 0 ? -3 : 0,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            border: '1px solid #a93226',
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    />
                ))}
            </div>
            <span style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                background: 'rgba(0,0,0,0.6)',
                padding: '1px 5px',
                borderRadius: 4,
            }}>
                {amount}BB
            </span>
        </motion.div>
    );
}

// Pot to winner animation
function PotToWinnerAnimation({ amount, winnerPosition, layoutPosition }) {
    if (!amount || !winnerPosition) return null;

    // 위너 방향으로 이동
    const getTargetPosition = () => {
        switch (layoutPosition) {
            case 'top': return { x: 0, y: -200 };
            case 'bottom': return { x: 0, y: 200 };
            case 'left': return { x: -250, y: 0 };
            case 'right': return { x: 250, y: 0 };
            default: return { x: 0, y: 0 };
        }
    };

    const target = getTargetPosition();

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 100,
            }}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.8],
                x: target.x,
                y: target.y,
            }}
            transition={{
                duration: 1.2,
                ease: 'easeInOut',
                times: [0, 0.3, 1],
            }}
        >
            <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            width: 24,
                            height: 8,
                            background: i < 4 ? 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)' :
                                i < 6 ? 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)' :
                                    'linear-gradient(180deg, #2980b9 0%, #1a5276 100%)',
                            borderRadius: 4,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                        }}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                    />
                ))}
            </div>
            <motion.span
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#f1c40f',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    marginTop: 8,
                }}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.4 }}
            >
                +{amount}BB
            </motion.span>
        </motion.div>
    );
}

function Player({ player, step, cardsDealt, yourCards, foldedPlayers, calledPlayers, checkedPlayers, raisedPlayers, betPlayers, blindPlayers, phase, playerChips, latestBet, phaseBets, cards, isShowdown, isRevealAll, scenarioPlayerCards, winner }) {
    const [iconError, setIconError] = useState(false);
    const showCards = cardsDealt && step >= 2;
    const isFolded = foldedPlayers.includes(player.position);
    const hasCalled = calledPlayers.includes(player.position);
    const hasChecked = checkedPlayers?.includes(player.position);
    const hasBet = betPlayers?.includes(player.position);
    const hasRaised = raisedPlayers?.includes(player.position);
    const hasPostedBlind = blindPlayers?.[player.position] && phase === 'preflop';
    const isWinner = winner === player.position;

    // 카드 결정: 자기 카드 또는 쇼다운 시 다른 플레이어 카드
    // isRevealAll이면 폴드한 플레이어도 카드 공개
    let playerCardsToShow = [null, null];
    if (player.isYou) {
        playerCardsToShow = yourCards;
    } else if (isRevealAll && scenarioPlayerCards?.[player.position]) {
        // reveal_all_hands: 폴드 여부 상관없이 모든 카드 공개
        playerCardsToShow = scenarioPlayerCards[player.position];
    } else if (isShowdown && !isFolded && scenarioPlayerCards?.[player.position]) {
        // 일반 쇼다운: 폴드 안한 플레이어만
        playerCardsToShow = scenarioPlayerCards[player.position];
    }
    const positionColor = positionColors[player.position];
    const positionIconUrl = getPositionIconUrl(player.position);

    // Use dynamic chip count if available
    const currentChips = playerChips?.[player.position] ?? player.chips;

    // Check if this player has a bet animation to show
    const betAmount = latestBet?.[player.position]?.amount;

    const isTop = player.layoutPosition === 'top';
    const isBottom = player.layoutPosition === 'bottom';
    const isLeft = player.layoutPosition === 'left';

    // 카드 위치 - BB/CO는 칩과 분리하기 위해 오프셋 조정
    const cardOffset = isTop
        ? { top: '100%', left: 'calc(50% + 40px)', transform: 'translateX(-50%)' }  // CO: 카드 오른쪽으로
        : isBottom
        ? { bottom: '100%', left: 'calc(50% - 40px)', transform: 'translateX(-50%)' }  // BB: 카드 왼쪽으로
        : isLeft
        ? { left: '100%', top: '50%', transform: 'translateY(-50%)' }
        : { right: '100%', top: '50%', transform: 'translateY(-50%)' };

    // 현재 표시할 액션 결정 (우선순위: FOLD > RAISE > BET > CALL > CHECK > BLIND)
    let currentAction = null;
    if (isFolded) currentAction = 'FOLD';
    else if (hasRaised) currentAction = 'RAISE';
    else if (hasBet) currentAction = 'BET';
    else if (hasCalled) currentAction = 'CALL';
    else if (hasChecked) currentAction = 'CHECK';
    else if (hasPostedBlind) {
        const blindAmount = blindPlayers[player.position];
        currentAction = `${blindAmount}BB`;
    }

    return (
        <motion.div
            className={`player ${player.isYou ? 'you' : ''} ${player.layoutPosition || ''}`}
            style={{
                ...player.style,
                ...(player.isYou ? {
                    filter: 'drop-shadow(0 0 12px rgba(231, 76, 60, 0.7))',
                } : {})
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: player.id * 0.1 }}
        >
            <div className="position-icon" style={iconError ? { background: positionColor } : {}}>
                {iconError ? (
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                        {player.position}
                    </span>
                ) : (
                    <img
                        src={positionIconUrl}
                        alt={player.position}
                        onError={() => setIconError(true)}
                    />
                )}
            </div>
            <div className="player-info">
                {/* YOU만 표시, 다른 플레이어는 포지션 아이콘으로 충분 */}
                {player.isYou && (
                    <div className="player-name" style={{
                        color: '#e74c3c',
                        fontWeight: 'bold',
                        textShadow: '0 0 8px rgba(231, 76, 60, 0.5)'
                    }}>
                        YOU
                    </div>
                )}
                <motion.div
                    className="player-chips"
                    key={currentChips}
                    initial={{ scale: 1.2, color: '#e74c3c' }}
                    animate={{ scale: 1, color: '#f1c40f' }}
                    transition={{ duration: 0.3 }}
                >
                    {currentChips}BB
                </motion.div>
            </div>
            <div className="player-cards" style={{ position: 'absolute', ...cardOffset }}>
                {showCards && playerCardsToShow.map((card, i) => (
                    <Card
                        key={i}
                        card={card}
                        dealOrder={player.dealOrder}
                        isFolded={isFolded}
                        isHidden={!player.isYou && !isShowdown && !isRevealAll}
                        isWinner={isWinner}
                        cards={cards}
                    />
                ))}
            </div>
            <AnimatePresence>
                {currentAction && (
                    <ActionIndicator action={currentAction} delay={0} />
                )}
            </AnimatePresence>
            {/* Phase별 베팅 칩 스택 (폴드해도 베팅한 칩은 계속 표시 - Pot에 흡수됨) */}
            <AnimatePresence>
                {phaseBets?.[player.position] > 0 && (
                    <PlayerChipStack
                        key={`phase-chips-${phase}`}
                        amount={phaseBets[player.position]}
                        layoutPosition={player.layoutPosition}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// 칩 더미 (커뮤니티 카드 위쪽에 표시)
function PotChips({ amount }) {
    if (!amount || amount <= 0) return null;

    const chipColors = {
        red: 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)',
        green: 'linear-gradient(180deg, #27ae60 0%, #1e8449 100%)',
        blue: 'linear-gradient(180deg, #3498db 0%, #2471a3 100%)',
    };

    // 칩 더미 생성 (대충 겹쳐서 쌓인 느낌)
    // 금액에 따라 칩 개수 조절 (많을수록 더 많은 칩)
    const chipCount = Math.min(12, Math.max(3, Math.ceil(amount / 20)));
    const chips = [];
    for (let i = 0; i < chipCount; i++) {
        const colorIndex = i % 3;
        const color = colorIndex === 0 ? 'red' : colorIndex === 1 ? 'green' : 'blue';
        // 랜덤하게 겹치는 느낌
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = i * -2;
        chips.push({ color, offsetX, offsetY, delay: i * 0.02 });
    }

    return (
        <motion.div
            className="pot-chips"
            style={{
                position: 'absolute',
                top: '32%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div style={{ position: 'relative', width: 60, height: 40 }}>
                {chips.map((chip, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: 20 + chip.offsetX,
                            bottom: 0,
                            width: 20,
                            height: 8,
                            background: chipColors[chip.color],
                            borderRadius: 4,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transform: `translateY(${chip.offsetY}px)`,
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: chip.offsetY }}
                        transition={{ delay: chip.delay, type: 'spring', stiffness: 300 }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

// 팟 금액 (테이블 왼쪽 아래 구석에 작게 표시)
function PotAmount({ amount }) {
    if (!amount || amount <= 0) return null;

    return (
        <motion.div
            className="pot-amount"
            style={{
                position: 'absolute',
                bottom: '-5%',
                left: '8%',
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#f1c40f',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 'bold',
                zIndex: 35,
                border: '1px solid rgba(241, 196, 15, 0.3)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            key={amount}
        >
            POT: {amount}BB
        </motion.div>
    );
}

function GamePhase({ currentPhase }) {
    const phases = ['Pre-flop', 'Flop', 'Turn', 'River'];
    const phaseOrder = { 'preflop': 0, 'flop': 1, 'turn': 2, 'river': 3 };
    const currentIndex = phaseOrder[currentPhase] ?? 0;

    return (
        <div className="game-phase">
            {phases.map((phase, i) => (
                <div
                    key={phase}
                    className={`phase ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'completed' : ''}`}
                >
                    {phase}
                </div>
            ))}
        </div>
    );
}

function StepIndicator({ step, totalSteps }) {
    return (
        <div className="step-indicator">
            {[...Array(totalSteps)].map((_, i) => (
                <div
                    key={i}
                    className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                />
            ))}
        </div>
    );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function HoldemTable({ gameState }) {
    // 고정 크기 사용 - Reveal.js가 슬라이드 전체를 스케일링
    const tableWidth = FIXED_TABLE_WIDTH;
    const scale = FIXED_SCALE;
    const cards = useCardBundle();
    const state = gameState.getState();
    const {
        step,
        totalSteps,
        phase,
        pot,
        collectedPot,
        communityCards,
        yourCards,
        yourPosition,
        currentStepData,
    } = state;

    // 모달 타입 체크
    const showPositionModal = currentStepData?.type === 'position_modal';
    const showActionModal = currentStepData?.type === 'action_modal';
    const showEquityModal = currentStepData?.type === 'equity_modal';
    const showEVModal = currentStepData?.type === 'ev_modal';
    const showComparisonModal = currentStepData?.type === 'comparison_modal';
    const showLessonModal = currentStepData?.type === 'lesson';
    const showPotOddsModal = currentStepData?.type === 'pot_odds_modal';
    const showInfoModal = currentStepData?.type === 'info_modal';

    // 쇼다운 체크 - showdown 또는 winner 스텝
    const isShowdown = currentStepData?.type === 'showdown' ||
                       currentStepData?.type === 'winner';

    // 모든 핸드 공개 (폴드한 플레이어 포함)
    const isRevealAll = currentStepData?.type === 'reveal_all_hands';

    // 시나리오에서 다른 플레이어 카드 가져오기
    const scenarioPlayerCards = gameState.scenario.playerCards || {};

    // 승자 정보
    const winner = currentStepData?.type === 'winner' ? currentStepData.winner : null;

    // 현재 Phase에서의 액션만 수집 (Phase 전환 시 리셋)
    // 폴드는 게임 전체에서 유지, 다른 액션은 현재 Phase만
    const foldedPlayers = [];
    const currentPhaseActions = {}; // { player: action }
    const blindPlayers = {}; // { player: 'SB' | 'BB' }

    // 마지막 phase 전환점 찾기
    let lastPhaseChangeStep = 0;
    for (let i = 0; i <= step; i++) {
        const s = gameState.scenario.steps[i];
        if (s?.type === 'flop' || s?.type === 'turn' || s?.type === 'river') {
            lastPhaseChangeStep = i;
        }
    }

    for (let i = 0; i <= step; i++) {
        const s = gameState.scenario.steps[i];
        // 폴드는 전체 게임에서 유지
        if (s?.type === 'action' && s.action === 'FOLD') {
            foldedPlayers.push(s.player);
        }
        // 블라인드 포스팅 표시 (실제 금액 저장)
        if (s?.type === 'blinds' && s.bets) {
            blindPlayers['SB'] = s.bets.SB;
            blindPlayers['BB'] = s.bets.BB;
        }
        // 현재 Phase의 액션만 (폴드 제외)
        if (i >= lastPhaseChangeStep && s?.type === 'action' && s.action !== 'FOLD') {
            currentPhaseActions[s.player] = s.action;
        }
    }

    // 현재 Phase의 CALL/CHECK/RAISE/BET 플레이어
    const calledPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CALL')
        .map(([player]) => player);
    const checkedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CHECK')
        .map(([player]) => player);
    const raisedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'RAISE')
        .map(([player]) => player);
    const betPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'BET')
        .map(([player]) => player);

    // 동적으로 "YOU" 포지션 설정
    const dynamicPlayerPositions = playerPositions.map(p => ({
        ...p,
        isYou: p.position === yourPosition,
    }));

    // Calculate player chip balances (initial - total bets)
    const playerChips = {};
    const latestBet = {}; // { player: { amount, stepIndex } } - for animation
    const phaseBets = {}; // { player: total bet amount in current phase }
    dynamicPlayerPositions.forEach(p => {
        playerChips[p.position] = p.chips; // Start with initial chips
        phaseBets[p.position] = 0;
    });

    for (let i = 0; i <= step; i++) {
        const s = gameState.scenario.steps[i];

        // Phase 전환 시 phaseBets 리셋
        if (s?.type === 'flop' || s?.type === 'turn' || s?.type === 'river') {
            dynamicPlayerPositions.forEach(p => {
                phaseBets[p.position] = 0;
            });
        }

        // Blind bets
        if (s?.type === 'blinds' && s.bets) {
            Object.entries(s.bets).forEach(([player, amount]) => {
                playerChips[player] -= amount;
                phaseBets[player] += amount;
                if (i === step) latestBet[player] = { amount, stepIndex: i };
            });
        }
        // Action bets
        if (s?.type === 'action' && s.bet > 0) {
            playerChips[s.player] -= s.bet;
            phaseBets[s.player] += s.bet;
            if (i === step) latestBet[s.player] = { amount: s.bet, stepIndex: i };
        }
    }

    // showdown/winner 스텝에서는 phaseBets 숨기기
    if (currentStepData?.type === 'showdown' || currentStepData?.type === 'winner') {
        dynamicPlayerPositions.forEach(p => {
            phaseBets[p.position] = 0;
        });
    }

    // CSS 변수로 스케일 전달
    const containerStyle = {
        '--scale': scale,
        '--table-width': `${tableWidth}px`,
        '--table-height': `${tableWidth * 0.625}px`,
    };

    // 플레이어 표시 시점 결정 (deal 또는 blinds 이후)
    const showPlayers = gameState.scenario.steps.slice(0, step + 1)
        .some(s => s?.type === 'deal' || s?.type === 'blinds' || s?.type === 'setup');

    // 카드 딜링 완료 체크
    const cardsDealt = gameState.scenario.steps.slice(0, step + 1)
        .some(s => s?.type === 'deal');

    return (
        <div className="container embed-mode" style={containerStyle}>
            <GamePhase currentPhase={phase} />
            <div className="poker-table">
                <div className="table-rail" />
                <div className="table-felt" />

                {showPlayers && dynamicPlayerPositions.map(player => (
                    <Player
                        key={player.id}
                        player={player}
                        step={step}
                        cardsDealt={cardsDealt}
                        yourCards={yourCards}
                        foldedPlayers={foldedPlayers}
                        calledPlayers={calledPlayers}
                        checkedPlayers={checkedPlayers}
                        raisedPlayers={raisedPlayers}
                        betPlayers={betPlayers}
                        blindPlayers={blindPlayers}
                        phase={phase}
                        playerChips={playerChips}
                        latestBet={latestBet}
                        phaseBets={phaseBets}
                        cards={cards}
                        isShowdown={isShowdown}
                        isRevealAll={isRevealAll}
                        scenarioPlayerCards={scenarioPlayerCards}
                        winner={winner}
                    />
                ))}

                {showPlayers && (
                    <motion.div
                        className="dealer-button"
                        style={{ top: '34%', right: '15%' }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <img src={getDealerButtonUrl()} alt="Dealer" className="dealer-button-img" />
                    </motion.div>
                )}

                {/* 팟 칩 더미 (커뮤니티 카드 위쪽) */}
                {cardsDealt && collectedPot > 0 && <PotChips amount={collectedPot} />}
                {/* 팟 금액 (왼쪽 아래 구석) */}
                {cardsDealt && collectedPot > 0 && <PotAmount amount={collectedPot} />}

                {/* Winner에게 Pot 이동 애니메이션 */}
                <AnimatePresence>
                    {winner && (() => {
                        const winnerPlayer = dynamicPlayerPositions.find(p => p.position === winner);
                        return winnerPlayer ? (
                            <PotToWinnerAnimation
                                key={`pot-to-winner-${step}`}
                                amount={pot}
                                winnerPosition={winner}
                                layoutPosition={winnerPlayer.layoutPosition}
                            />
                        ) : null;
                    })()}
                </AnimatePresence>

                <div className="community-cards">
                    {communityCards.map((card, i) => (
                        <CommunityCard key={i} card={card} dealOrder={i} cards={cards} />
                    ))}
                </div>

                <StepIndicator step={step} totalSteps={totalSteps} />

                {/* 포지션 설명 모달 */}
                <PositionInfoModal show={showPositionModal} />

                {/* 액션 설명 모달 */}
                <ActionInfoModal show={showActionModal} />

                {/* 승률(Equity) 모달 */}
                <EquityModal show={showEquityModal} data={currentStepData} />

                {/* EV 계산 모달 */}
                <EVModal show={showEVModal} data={currentStepData} />

                {/* 비교 모달 */}
                <ComparisonModal show={showComparisonModal} data={currentStepData} />

                {/* 교훈 모달 */}
                <LessonModal show={showLessonModal} data={currentStepData} />

                {/* Pot Odds 교육 모달 */}
                <PotOddsModal show={showPotOddsModal} data={currentStepData} />

                {/* 정보 모달 (일반) */}
                {showInfoModal && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            pointerEvents: 'none',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            style={{
                                background: 'rgba(0, 0, 0, 0.95)',
                                borderRadius: 16,
                                padding: '24px 32px',
                                width: 380,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                                border: '1px solid rgba(39, 174, 96, 0.3)',
                            }}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                        >
                            <div style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#27ae60',
                                marginBottom: 16,
                                textAlign: 'center',
                            }}>
                                ✅ {currentStepData?.title}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {currentStepData?.content?.map((item, i) => (
                                    <div key={i} style={{
                                        fontSize: 14,
                                        color: '#fff',
                                        padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 6,
                                    }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
