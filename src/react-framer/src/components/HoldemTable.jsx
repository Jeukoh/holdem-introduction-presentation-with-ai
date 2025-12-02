import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardBundle } from '../hooks/useCardBundle';

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
const playerPositions = [
    { id: 1, position: 'CO', name: 'CO', chips: 5000, dealOrder: 5, layoutPosition: 'top',
      style: { top: 'calc(-1 * var(--player-offset-top))', left: '50%', transform: 'translateX(-50%)' } },
    { id: 2, position: 'BTN', name: 'BTN', chips: 7500, dealOrder: 6, layoutPosition: 'right',
      style: { top: 'var(--player-offset-side-inner)', right: 'calc(-1 * var(--player-offset-side))' } },
    { id: 3, position: 'SB', name: 'SB', chips: 4200, dealOrder: 1, layoutPosition: 'right',
      style: { bottom: 'var(--player-offset-side-inner)', right: 'calc(-1 * var(--player-offset-side))' } },
    { id: 4, position: 'BB', name: 'YOU (BB)', chips: 6000, dealOrder: 2, isYou: true, layoutPosition: 'bottom',
      style: { bottom: 'calc(-1 * var(--player-offset-top))', left: '50%', transform: 'translateX(-50%)' } },
    { id: 5, position: 'UTG', name: 'UTG', chips: 3800, dealOrder: 3, layoutPosition: 'left',
      style: { bottom: 'var(--player-offset-side-inner)', left: 'calc(-1 * var(--player-offset-side))' } },
    { id: 6, position: 'HJ', name: 'HJ', chips: 5500, dealOrder: 4, layoutPosition: 'left',
      style: { top: 'var(--player-offset-side-inner)', left: 'calc(-1 * var(--player-offset-side))' } },
];

const positionColors = {
    BTN: '#f1c40f',
    SB: '#e74c3c',
    BB: '#e74c3c',
    UTG: '#3498db',
    HJ: '#9b59b6',
    CO: '#27ae60',
};

// ===========================================
// ASSET HELPERS
// ===========================================

const BASE = import.meta.env.BASE_URL || '/';
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
    return `${BASE}assets/positions/${position}.svg`;
}

function getDealerButtonUrl() {
    return `${BASE}assets/decorative/dealer-button.svg`;
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

function Card({ card, dealOrder = 0, isFolded = false, isHidden = true, cards }) {
    const delay = dealOrder * 0.15;
    const cardId = isHidden ? null : getCardId(card);

    return (
        <motion.div
            className={`card-wrapper ${isFolded ? 'folded' : ''}`}
            initial={{ opacity: 0, y: -100, rotateY: 180 }}
            animate={{
                opacity: isFolded ? 0.3 : 1,
                y: 0,
                rotateY: 0
            }}
            transition={{
                delay,
                duration: 0.4,
                type: 'spring',
                stiffness: 200
            }}
        >
            <div className="card-image">
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

// Chip animation component - shows chips flying from player to pot
function ChipAnimation({ amount, layoutPosition }) {
    if (!amount || amount <= 0) return null;

    // Calculate animation direction based on player position
    const getAnimationTarget = () => {
        switch (layoutPosition) {
            case 'top': return { x: 0, y: 150 };
            case 'bottom': return { x: 0, y: -150 };
            case 'left': return { x: 200, y: 0 };
            case 'right': return { x: -200, y: 0 };
            default: return { x: 0, y: 0 };
        }
    };

    const target = getAnimationTarget();

    return (
        <motion.div
            className="chip-animation"
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: [1, 1, 0],
                scale: [1, 0.8, 0.5],
                x: target.x,
                y: target.y
            }}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
                times: [0, 0.7, 1]
            }}
        >
            <div className="chip-stack">
                <div className="chip red" />
                <div className="chip red" />
                <div className="chip red" />
            </div>
            <span className="chip-amount">${amount}</span>
        </motion.div>
    );
}

function Player({ player, step, cardsDealt, yourCards, foldedPlayers, calledPlayers, checkedPlayers, raisedPlayers, blindPlayers, phase, playerChips, latestBet, cards }) {
    const [iconError, setIconError] = useState(false);
    const showCards = cardsDealt && step >= 2;
    const isFolded = foldedPlayers.includes(player.position);
    const hasCalled = calledPlayers.includes(player.position);
    const hasChecked = checkedPlayers?.includes(player.position);
    const hasRaised = raisedPlayers?.includes(player.position);
    const hasPostedBlind = blindPlayers?.[player.position] && phase === 'preflop';

    const playerCards = player.isYou ? yourCards : [null, null];
    const positionColor = positionColors[player.position];
    const positionIconUrl = getPositionIconUrl(player.position);

    // Use dynamic chip count if available
    const currentChips = playerChips?.[player.position] ?? player.chips;

    // Check if this player has a bet animation to show
    const betAmount = latestBet?.[player.position]?.amount;

    const isTop = player.layoutPosition === 'top';
    const isBottom = player.layoutPosition === 'bottom';
    const isLeft = player.layoutPosition === 'left';

    const cardOffset = isTop ? { top: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isBottom ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isLeft ? { left: '100%', top: '50%', transform: 'translateY(-50%)' }
        : { right: '100%', top: '50%', transform: 'translateY(-50%)' };

    // 현재 표시할 액션 결정 (우선순위: FOLD > RAISE > CALL > CHECK > BLIND)
    let currentAction = null;
    if (isFolded) currentAction = 'FOLD';
    else if (hasRaised) currentAction = 'RAISE';
    else if (hasCalled) currentAction = 'CALL';
    else if (hasChecked) currentAction = 'CHECK';
    else if (hasPostedBlind) currentAction = player.position === 'SB' ? 'SB $50' : 'BB $100';

    return (
        <motion.div
            className={`player ${player.isYou ? 'you' : ''} ${player.layoutPosition || ''}`}
            style={player.style}
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
                <div className="player-name" style={player.isYou ? { color: positionColor } : {}}>
                    {player.isYou ? 'YOU' : player.position}
                </div>
                <motion.div
                    className="player-chips"
                    key={currentChips}
                    initial={{ scale: 1.2, color: '#e74c3c' }}
                    animate={{ scale: 1, color: '#f1c40f' }}
                    transition={{ duration: 0.3 }}
                >
                    ${currentChips.toLocaleString()}
                </motion.div>
            </div>
            <div className="player-cards" style={{ position: 'absolute', ...cardOffset }}>
                {showCards && playerCards.map((card, i) => (
                    <Card
                        key={i}
                        card={card}
                        dealOrder={player.dealOrder}
                        isFolded={isFolded}
                        isHidden={!player.isYou}
                        cards={cards}
                    />
                ))}
            </div>
            <AnimatePresence>
                {currentAction && (
                    <ActionIndicator action={currentAction} delay={0} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {betAmount > 0 && (
                    <ChipAnimation
                        key={`chip-${step}`}
                        amount={betAmount}
                        layoutPosition={player.layoutPosition}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function Pot({ amount }) {
    return (
        <motion.div
            className="pot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <div className="pot-label">POT</div>
            <motion.div
                className="pot-amount"
                key={amount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
            >
                ${amount}
            </motion.div>
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
        communityCards,
        yourCards,
    } = state;

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
        // 블라인드 포스팅 표시
        if (s?.type === 'blinds') {
            blindPlayers['SB'] = 'SB';
            blindPlayers['BB'] = 'BB';
        }
        // 현재 Phase의 액션만 (폴드 제외)
        if (i >= lastPhaseChangeStep && s?.type === 'action' && s.action !== 'FOLD') {
            currentPhaseActions[s.player] = s.action;
        }
    }

    // 현재 Phase의 CALL/CHECK/RAISE 플레이어
    const calledPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CALL')
        .map(([player]) => player);
    const checkedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CHECK')
        .map(([player]) => player);
    const raisedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'RAISE')
        .map(([player]) => player);

    // Calculate player chip balances (initial - total bets)
    const playerChips = {};
    const latestBet = {}; // { player: { amount, stepIndex } } - for animation
    playerPositions.forEach(p => {
        playerChips[p.position] = p.chips; // Start with initial chips
    });

    for (let i = 0; i <= step; i++) {
        const s = gameState.scenario.steps[i];
        // Blind bets
        if (s?.type === 'blinds' && s.bets) {
            Object.entries(s.bets).forEach(([player, amount]) => {
                playerChips[player] -= amount;
                if (i === step) latestBet[player] = { amount, stepIndex: i };
            });
        }
        // Action bets
        if (s?.type === 'action' && s.bet > 0) {
            playerChips[s.player] -= s.bet;
            if (i === step) latestBet[s.player] = { amount: s.bet, stepIndex: i };
        }
    }

    // CSS 변수로 스케일 전달
    const containerStyle = {
        '--scale': scale,
        '--table-width': `${tableWidth}px`,
        '--table-height': `${tableWidth * 0.625}px`,
    };

    return (
        <div className="container embed-mode" style={containerStyle}>
            <GamePhase currentPhase={phase} />
            <div className="poker-table">
                <div className="table-rail" />
                <div className="table-felt" />

                {step >= 1 && playerPositions.map(player => (
                    <Player
                        key={player.id}
                        player={player}
                        step={step}
                        cardsDealt={step >= 2}
                        yourCards={yourCards}
                        foldedPlayers={foldedPlayers}
                        calledPlayers={calledPlayers}
                        checkedPlayers={checkedPlayers}
                        raisedPlayers={raisedPlayers}
                        blindPlayers={blindPlayers}
                        phase={phase}
                        playerChips={playerChips}
                        latestBet={latestBet}
                        cards={cards}
                    />
                ))}

                {step >= 1 && (
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

                {step >= 2 && <Pot amount={pot} />}

                <div className="community-cards">
                    {communityCards.map((card, i) => (
                        <CommunityCard key={i} card={card} dealOrder={i} cards={cards} />
                    ))}
                </div>

                <StepIndicator step={step} totalSteps={totalSteps} />
            </div>
        </div>
    );
}
