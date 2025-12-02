import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parsePHH, examplePHH } from './phhParser'

// ===========================================
// GAME ENGINE - 순수 게임 시뮬레이션
// 발표 로직 없음, 게임 상태만 관리
// ===========================================

// Parse example PHH to create a scenario
const phhScenario = parsePHH(examplePHH)

const scenarios = {
    phh: phhScenario,  // PHH로 생성된 시나리오

    // ===========================================
    // 튜토리얼: 한 판의 홀덤 전체 흐름
    // 순수 게임 시뮬레이션 (설명은 Reveal.js에서)
    // ===========================================
    tutorial: {
        name: '🎓 Tutorial: 한 판의 홀덤',
        yourPosition: 'BB',
        yourCards: [
            { suit: '♥', rank: 'A', color: 'red' },
            { suit: '♠', rank: '7', color: 'black' }
        ],
        steps: [
            // 1. 테이블 셋업
            { type: 'setup', description: '테이블 셋업' },

            // 2. 카드 딜링
            { type: 'deal', description: '카드 딜링' },

            // 3. 블라인드 포스팅
            { type: 'blinds', pot: 150, bets: { SB: 50, BB: 100 }, description: 'SB $50 + BB $100' },

            // 4. Pre-flop 액션들
            { type: 'action', player: 'UTG', action: 'FOLD', bet: 0, pot: 150, description: 'UTG 폴드' },
            { type: 'action', player: 'HJ', action: 'CALL', bet: 100, pot: 250, description: 'HJ $100 콜' },
            { type: 'action', player: 'CO', action: 'FOLD', bet: 0, pot: 250, description: 'CO 폴드' },
            { type: 'action', player: 'BTN', action: 'FOLD', bet: 0, pot: 250, description: 'BTN 폴드' },
            { type: 'action', player: 'SB', action: 'CALL', bet: 50, pot: 300, description: 'SB $50 콜' },
            { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 300, description: 'BB 체크' },

            // 5. 플랍
            {
                type: 'flop',
                cards: [
                    { suit: '♥', rank: 'K', color: 'red' },
                    { suit: '♦', rank: '7', color: 'red' },
                    { suit: '♣', rank: '2', color: 'black' }
                ],
                pot: 300,
                description: '플랍: K♥ 7♦ 2♣'
            },

            // 6. 턴
            {
                type: 'turn',
                card: { suit: '♠', rank: '3', color: 'black' },
                pot: 300,
                description: '턴: 3♠'
            },

            // 7. 리버
            {
                type: 'river',
                card: { suit: '♥', rank: 'A', color: 'red' },
                pot: 300,
                description: '리버: A♥'
            }
        ]
    },

    preflop: {
        name: 'Pre-flop Basic',
        yourPosition: 'BB',
        yourCards: [
            { suit: '♥', rank: 'A', color: 'red' },
            { suit: '♠', rank: '7', color: 'black' }
        ],
        steps: [
            { type: 'setup', description: '테이블 셋업' },
            { type: 'deal', description: '카드 딜링' },
            { type: 'blinds', pot: 150, description: '블라인드 포스팅' },
            { type: 'action', player: 'UTG', action: 'FOLD', description: 'UTG 폴드' },
            { type: 'action', player: 'HJ', action: 'CALL', pot: 250, description: 'HJ 콜' },
            { type: 'your_turn', description: '당신의 차례' }
        ]
    },
    flop: {
        name: 'Flop Decision',
        yourPosition: 'BTN',
        yourCards: [
            { suit: '♠', rank: 'K', color: 'black' },
            { suit: '♠', rank: 'Q', color: 'black' }
        ],
        communityCards: [
            { suit: '♠', rank: 'J', color: 'black' },
            { suit: '♥', rank: '10', color: 'red' },
            { suit: '♦', rank: '2', color: 'red' }
        ],
        steps: [
            { type: 'setup', description: '테이블 셋업' },
            { type: 'deal', description: '카드 딜링' },
            { type: 'flop', description: '플랍 오픈' },
            { type: 'your_turn', description: '플러시 드로우 + 스트레이트 드로우!' }
        ]
    }
}

// 6-handed table positions (using CSS variables for responsive layout)
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
]

// Position colors (fallback if SVG not loaded)
const positionColors = {
    BTN: '#f1c40f',  // Gold - Dealer
    SB: '#e74c3c',   // Red
    BB: '#e74c3c',   // Red
    UTG: '#3498db',  // Blue - Early
    HJ: '#9b59b6',   // Purple - Middle
    CO: '#27ae60',   // Green - Late
}

// ===========================================
// ASSET HELPERS
// ===========================================

// Convert suit symbol to file code
const suitToCode = { '♥': 'H', '♦': 'D', '♣': 'C', '♠': 'S' }

// Get card image URL (상대 경로 - localhost와 GitHub Pages 모두 작동)
function getCardImageUrl(card) {
    if (!card) return `assets/cards/back.svg`
    const suitCode = suitToCode[card.suit] || 'S'
    const rankCode = card.rank === '10' ? '10' : card.rank
    return `assets/cards/${rankCode}${suitCode}.svg`
}

// Get position icon URL
function getPositionIconUrl(position) {
    return `assets/positions/${position}.svg`
}

// Get dealer button URL
function getDealerButtonUrl() {
    return `assets/decorative/dealer-button.svg`
}

// Your cards
const yourCards = [
    { suit: '♥', rank: 'A', color: 'red' },
    { suit: '♠', rank: '7', color: 'black' }
]

function Card({ card, dealOrder = 0, isFolded = false, isHidden = true }) {
    const delay = dealOrder * 0.15
    const imgSrc = isHidden ? getCardImageUrl(null) : getCardImageUrl(card)

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
            <img
                src={imgSrc}
                alt={isHidden ? 'Card back' : `${card?.rank}${card?.suit}`}
                className="card-image"
            />
        </motion.div>
    )
}

// Community card with SVG
function CommunityCard({ card, dealOrder = 0 }) {
    const delay = dealOrder * 0.15
    const imgSrc = getCardImageUrl(card)

    return (
        <motion.div
            className="community-card-wrapper"
            initial={{ opacity: 0, y: -50, rotateY: 180 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay, duration: 0.4, type: 'spring' }}
        >
            <img
                src={imgSrc}
                alt={`${card?.rank}${card?.suit}`}
                className="community-card-image"
            />
        </motion.div>
    )
}

// Chip animation component - shows chips flying from player to pot
function ChipAnimation({ amount, layoutPosition }) {
    if (!amount || amount <= 0) return null

    // Calculate animation direction based on player position
    const getAnimationTarget = () => {
        switch (layoutPosition) {
            case 'top': return { x: 0, y: 150 }
            case 'bottom': return { x: 0, y: -150 }
            case 'left': return { x: 200, y: 0 }
            case 'right': return { x: -200, y: 0 }
            default: return { x: 0, y: 0 }
        }
    }

    const target = getAnimationTarget()

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
    )
}

function ActionIndicator({ action, delay }) {
    const actionClass = action.toLowerCase()
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
    )
}

function Player({ player, step, cardsDealt, foldedPlayers, calledPlayers, checkedPlayers, raisedPlayers, blindPlayers, phase, playerChips, latestBet }) {
    const [iconError, setIconError] = useState(false)
    const showCards = cardsDealt && step >= 2
    const isFolded = foldedPlayers?.includes(player.position)
    const hasCalled = calledPlayers?.includes(player.position)
    const hasChecked = checkedPlayers?.includes(player.position)
    const hasRaised = raisedPlayers?.includes(player.position)
    const hasPostedBlind = blindPlayers?.[player.position] && phase === 'preflop'

    const cards = player.isYou ? yourCards : [null, null]
    const positionColor = positionColors[player.position]
    const positionIconUrl = getPositionIconUrl(player.position)

    // Use dynamic chip count if available
    const currentChips = playerChips?.[player.position] ?? player.chips

    // Check if this player has a bet animation to show
    const betAmount = latestBet?.[player.position]?.amount

    const isTop = player.layoutPosition === 'top'
    const isBottom = player.layoutPosition === 'bottom'
    const isLeft = player.layoutPosition === 'left'

    // Cards offset toward table center
    const cardOffset = isTop ? { top: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isBottom ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)' }
        : isLeft ? { left: '100%', top: '50%', transform: 'translateY(-50%)' }
        : { right: '100%', top: '50%', transform: 'translateY(-50%)' }

    // Determine current action to display (priority: FOLD > RAISE > CALL > CHECK > BLIND)
    let currentAction = null
    if (isFolded) currentAction = 'FOLD'
    else if (hasRaised) currentAction = 'RAISE'
    else if (hasCalled) currentAction = 'CALL'
    else if (hasChecked) currentAction = 'CHECK'
    else if (hasPostedBlind) currentAction = player.position === 'SB' ? 'SB $50' : 'BB $100'

    const PlayerCards = () => (
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
    )

    const PositionIcon = () => (
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
    )

    const PlayerInfo = () => (
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
    )

    // Action indicator class (blind uses 'blind' class)
    const getActionClass = (action) => {
        if (!action) return ''
        if (action.includes('$')) return 'blind'
        return action.toLowerCase()
    }

    return (
        <motion.div
            className={`player ${player.isYou ? 'you' : ''} ${player.layoutPosition || ''}`}
            style={player.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: player.id * 0.1 }}
        >
            <PositionIcon />
            <PlayerInfo />
            <PlayerCards />
            <AnimatePresence>
                {currentAction && (
                    <motion.div
                        className={`action-indicator ${getActionClass(currentAction)}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                        {currentAction}
                    </motion.div>
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
    )
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
    )
}

// ===========================================
// NOTE: ExplanationOverlay와 InterruptOverlay 제거됨
// 발표용 설명은 Reveal.js 슬라이드에서 담당
// 이 엔진은 순수 게임 시뮬레이션만 수행
// ===========================================

function GamePhase({ currentPhase }) {
    const phases = ['Pre-flop', 'Flop', 'Turn', 'River']
    const phaseOrder = { 'preflop': 0, 'flop': 1, 'turn': 2, 'river': 3 }
    const currentIndex = phaseOrder[currentPhase] ?? 0

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
    )
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
    )
}

// ===========================================
// URL Parameter Parser for iframe embedding
// Usage: ?scenario=preflop&step=3&embed=true
// ===========================================
function getUrlParams() {
    const params = new URLSearchParams(window.location.search)
    return {
        scenario: params.get('scenario') || 'preflop',
        initialStep: parseInt(params.get('step') || '0'),
        embed: params.get('embed') === 'true',
        autoplay: params.get('autoplay') === 'true'
    }
}

export default function App() {
    const urlParams = getUrlParams()
    const [scenarioKey, setScenarioKey] = useState(urlParams.scenario)
    const [step, setStep] = useState(urlParams.initialStep)
    const scenario = scenarios[scenarioKey] || scenarios.preflop
    const totalSteps = scenario.steps.length

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1))
    const prevStep = () => setStep(s => Math.max(s - 1, 0))
    const reset = () => setStep(0)

    // Listen for postMessage from parent (Reveal.js)
    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data.type === 'holdem-control') {
                if (e.data.action === 'next') nextStep()
                else if (e.data.action === 'prev') prevStep()
                else if (e.data.action === 'reset') reset()
                else if (e.data.action === 'goto') setStep(e.data.step)
                else if (e.data.action === 'scenario') {
                    setScenarioKey(e.data.scenario)
                    setStep(0)
                }
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    // Keyboard controls: Space/Right = next, Left = prev, R = reset
    useEffect(() => {
        if (urlParams.embed) return // Disable keyboard in embed mode

        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowRight') {
                e.preventDefault()
                setStep(s => Math.min(s + 1, totalSteps - 1))
            } else if (e.code === 'ArrowLeft') {
                setStep(s => Math.max(s - 1, 0))
            } else if (e.key === 'r' || e.key === 'R') {
                setStep(0)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [urlParams.embed, totalSteps])

    // Autoplay mode
    useEffect(() => {
        if (!urlParams.autoplay) return
        const timer = setInterval(() => {
            setStep(s => s < totalSteps - 1 ? s + 1 : s)
        }, 1500)
        return () => clearInterval(timer)
    }, [urlParams.autoplay, totalSteps])

    const currentStepData = scenario.steps[step] || {}
    const potAmount = currentStepData.pot || (step >= 2 ? 150 : 0)

    // Collect community cards from all previous steps
    const communityCards = []
    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        if (s?.type === 'flop' && s.cards) {
            communityCards.push(...s.cards)
        } else if ((s?.type === 'turn' || s?.type === 'river') && s.card) {
            communityCards.push(s.card)
        }
    }

    // Determine current game phase
    let currentPhase = 'preflop'
    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        if (s?.type === 'flop') currentPhase = 'flop'
        else if (s?.type === 'turn') currentPhase = 'turn'
        else if (s?.type === 'river') currentPhase = 'river'
    }

    // Collect actions per phase (reset on phase change)
    // FOLD persists across phases, other actions reset
    const foldedPlayers = []
    const currentPhaseActions = {} // { player: action }
    const blindPlayers = {} // { player: 'SB' | 'BB' }

    // Find last phase change step
    let lastPhaseChangeStep = 0
    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        if (s?.type === 'flop' || s?.type === 'turn' || s?.type === 'river') {
            lastPhaseChangeStep = i
        }
    }

    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        // FOLD persists throughout the game
        if (s?.type === 'action' && s.action === 'FOLD') {
            foldedPlayers.push(s.player)
        }
        // Blind posting display
        if (s?.type === 'blinds') {
            blindPlayers['SB'] = 'SB'
            blindPlayers['BB'] = 'BB'
        }
        // Only current phase actions (except FOLD)
        if (i >= lastPhaseChangeStep && s?.type === 'action' && s.action !== 'FOLD') {
            currentPhaseActions[s.player] = s.action
        }
    }

    // Extract action arrays from currentPhaseActions
    const calledPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CALL')
        .map(([player]) => player)
    const checkedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'CHECK')
        .map(([player]) => player)
    const raisedPlayers = Object.entries(currentPhaseActions)
        .filter(([_, action]) => action === 'RAISE')
        .map(([player]) => player)

    // Calculate player chip balances (initial - total bets)
    const playerChips = {}
    const latestBet = {} // { player: { amount, stepIndex } } - for animation
    playerPositions.forEach(p => {
        playerChips[p.position] = p.chips // Start with initial chips
    })

    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        // Blind bets
        if (s?.type === 'blinds' && s.bets) {
            Object.entries(s.bets).forEach(([player, amount]) => {
                playerChips[player] -= amount
                if (i === step) latestBet[player] = { amount, stepIndex: i }
            })
        }
        // Action bets
        if (s?.type === 'action' && s.bet > 0) {
            playerChips[s.player] -= s.bet
            if (i === step) latestBet[s.player] = { amount: s.bet, stepIndex: i }
        }
    }

    // Embed mode: hide controls, show only table
    if (urlParams.embed) {
        return (
            <div className="container embed-mode">
                <GamePhase currentPhase={currentPhase} />
                <div className="poker-table">
                    <div className="table-rail" />
                    <div className="table-felt" />
                    {step >= 1 && playerPositions.map(player => (
                        <Player
                            key={player.id}
                            player={player}
                            step={step}
                            cardsDealt={step >= 2}
                            foldedPlayers={foldedPlayers}
                            calledPlayers={calledPlayers}
                            checkedPlayers={checkedPlayers}
                            raisedPlayers={raisedPlayers}
                            blindPlayers={blindPlayers}
                            phase={currentPhase}
                            playerChips={playerChips}
                            latestBet={latestBet}
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
                    {step >= 2 && <Pot amount={potAmount} />}
                    <div className="community-cards">
                        {communityCards.map((card, i) => (
                            <CommunityCard key={i} card={card} dealOrder={i} />
                        ))}
                    </div>
                    <StepIndicator step={step} totalSteps={totalSteps} />
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <h1>React + Framer Motion Prototype</h1>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                Space/→ = Next | ← = Prev | R = Reset |
                <span style={{ color: '#3498db' }}> Scenario: {scenario.name}</span>
            </p>

            <div className="controls">
                <button onClick={prevStep}>← Prev</button>
                <button onClick={nextStep}>Next →</button>
                <button onClick={reset}>Reset</button>
                <select value={scenarioKey} onChange={e => { setScenarioKey(e.target.value); setStep(0); }}
                    style={{ padding: '12px', borderRadius: '8px', marginLeft: '10px' }}>
                    {Object.keys(scenarios).map(key => (
                        <option key={key} value={key}>{scenarios[key].name}</option>
                    ))}
                </select>
            </div>

            <GamePhase currentPhase={currentPhase} />

            <div className="poker-table">
                <div className="table-rail" />
                <div className="table-felt" />

                {step >= 1 && playerPositions.map(player => (
                    <Player
                        key={player.id}
                        player={player}
                        step={step}
                        cardsDealt={step >= 2}
                        foldedPlayers={foldedPlayers}
                        calledPlayers={calledPlayers}
                        checkedPlayers={checkedPlayers}
                        raisedPlayers={raisedPlayers}
                        blindPlayers={blindPlayers}
                        phase={currentPhase}
                        playerChips={playerChips}
                        latestBet={latestBet}
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

                {step >= 2 && <Pot amount={potAmount} />}

                <div className="community-cards">
                    {communityCards.map((card, i) => (
                        <CommunityCard key={i} card={card} dealOrder={i} />
                    ))}
                </div>

                <StepIndicator step={step} totalSteps={totalSteps} />
            </div>
        </div>
    )
}
