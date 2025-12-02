import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===========================================
// CONSTANTS
// ===========================================

// 6-handed table positions
const playerPositions = [
    { id: 1, position: 'CO', name: 'CO', chips: 5000, dealOrder: 5, layoutPosition: 'top',
      style: { top: '-75px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 2, position: 'BTN', name: 'BTN', chips: 7500, dealOrder: 6, layoutPosition: 'right',
      style: { top: '100px', right: '-90px' } },
    { id: 3, position: 'SB', name: 'SB', chips: 4200, dealOrder: 1, layoutPosition: 'right',
      style: { bottom: '100px', right: '-90px' } },
    { id: 4, position: 'BB', name: 'YOU (BB)', chips: 6000, dealOrder: 2, isYou: true, layoutPosition: 'bottom',
      style: { bottom: '-75px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 5, position: 'UTG', name: 'UTG', chips: 3800, dealOrder: 3, layoutPosition: 'left',
      style: { bottom: '100px', left: '-90px' } },
    { id: 6, position: 'HJ', name: 'HJ', chips: 5500, dealOrder: 4, layoutPosition: 'left',
      style: { top: '100px', left: '-90px' } },
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
// 카드 렌더링 데이터
const suitData = {
    '♥': { symbol: 'SH', color: 'red' },
    '♦': { symbol: 'SD', color: 'red' },
    '♣': { symbol: 'SC', color: 'black' },
    '♠': { symbol: 'SS', color: 'black' },
};

function getCardData(card) {
    if (!card) return null;  // 카드 뒷면
    const suit = suitData[card.suit] || suitData['♠'];
    // 새 에셋은 '10' 대신 'T' 사용
    const rankCode = card.rank === '10' ? 'T' : card.rank;
    return { rankSymbol: `V${rankCode}`, suitSymbol: suit.symbol, color: suit.color };
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

// CardBack: 카드 뒷면 (클래식 스타일 - 빨간 테두리)
function CardBack() {
    return (
        <g>
            <rect width="239" height="335" x="-119.5" y="-167.5" rx="12" fill="white" stroke="black" />
            <rect width="216" height="312" x="-108" y="-156" rx="8" fill="#b22222" />
            <rect width="196" height="292" x="-98" y="-146" rx="4" fill="none" stroke="white" strokeWidth="2" />
        </g>
    );
}

function Card({ card, dealOrder = 0, isFolded = false, isHidden = true }) {
    const delay = dealOrder * 0.15;
    const cardData = isHidden ? null : getCardData(card);

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
            <svg
                viewBox="-120 -168 240 336"
                preserveAspectRatio="none"
                className="card-image"
            >
                {cardData ? (
                    <CardFace {...cardData} />
                ) : (
                    <CardBack />
                )}
            </svg>
        </motion.div>
    );
}

function CommunityCard({ card, dealOrder = 0 }) {
    const delay = dealOrder * 0.15;
    const cardData = getCardData(card);

    return (
        <motion.div
            className="community-card-wrapper"
            initial={{ opacity: 0, y: -50, rotateY: 180 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay, duration: 0.4, type: 'spring' }}
        >
            <svg
                viewBox="-120 -168 240 336"
                preserveAspectRatio="none"
                className="community-card-image"
            >
                {cardData ? (
                    <CardFace {...cardData} />
                ) : (
                    <CardBack />
                )}
            </svg>
        </motion.div>
    );
}

function ActionIndicator({ action, delay }) {
    const actionClass = action.toLowerCase();
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

function Player({ player, step, cardsDealt, yourCards, foldedPlayers, calledPlayers }) {
    const [iconError, setIconError] = useState(false);
    const showCards = cardsDealt && step >= 2;
    const isFolded = foldedPlayers.includes(player.position);
    const hasCalled = calledPlayers.includes(player.position);

    const cards = player.isYou ? yourCards : [null, null];
    const positionColor = positionColors[player.position];
    const positionIconUrl = getPositionIconUrl(player.position);

    const isTop = player.layoutPosition === 'top';
    const isBottom = player.layoutPosition === 'bottom';
    const isLeft = player.layoutPosition === 'left';

    const cardOffset = isTop ? { top: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isBottom ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isLeft ? { left: '100%', top: '50%', transform: 'translateY(-50%)' }
        : { right: '100%', top: '50%', transform: 'translateY(-50%)' };

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
                <div className="player-chips">${player.chips.toLocaleString()}</div>
            </div>
            <div className="player-cards" style={{ position: 'absolute', ...cardOffset }}>
                {showCards && cards.map((card, i) => (
                    <Card
                        key={i}
                        card={card}
                        dealOrder={player.dealOrder}
                        isFolded={isFolded}
                        isHidden={!player.isYou}
                    />
                ))}
            </div>
            <AnimatePresence>
                {isFolded && (
                    <ActionIndicator action="FOLD" delay={0} />
                )}
                {hasCalled && !isFolded && (
                    <ActionIndicator action="CALL" delay={0} />
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
    const state = gameState.getState();
    const {
        step,
        totalSteps,
        phase,
        pot,
        communityCards,
        yourCards,
    } = state;

    // 폴드/콜한 플레이어 계산
    const foldedPlayers = [];
    const calledPlayers = [];

    for (let i = 0; i <= step; i++) {
        const s = gameState.scenario.steps[i];
        if (s?.type === 'action') {
            if (s.action === 'FOLD') foldedPlayers.push(s.player);
            if (s.action === 'CALL') calledPlayers.push(s.player);
        }
    }

    return (
        <div className="container embed-mode">
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
                    />
                ))}

                {step >= 1 && (
                    <motion.div
                        className="dealer-button"
                        style={{ top: '170px', right: '120px' }}
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
                        <CommunityCard key={i} card={card} dealOrder={i} />
                    ))}
                </div>

                <StepIndicator step={step} totalSteps={totalSteps} />
            </div>
        </div>
    );
}
