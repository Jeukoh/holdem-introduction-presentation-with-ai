import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parsePHH, examplePHH } from './phhParser'

// ===========================================
// SCENARIO ENGINE - 시나리오 정의
// ===========================================

// Parse example PHH to create a scenario
const phhScenario = parsePHH(examplePHH)

const scenarios = {
    phh: phhScenario,  // PHH로 생성된 시나리오

    // ===========================================
    // 튜토리얼: 홀덤을 처음 배우는 사람을 위한 시나리오
    // 게임 진행 중 Interrupt로 설명 삽입
    // ===========================================
    tutorial: {
        name: '🎓 Tutorial: 처음 배우는 홀덤',
        yourPosition: 'BB',
        yourCards: [
            { suit: '♥', rank: 'A', color: 'red' },
            { suit: '♠', rank: '7', color: 'black' }
        ],
        steps: [
            // 1. 테이블에 앉음
            { type: 'setup', description: '6인 테이블에 앉았습니다' },

            // 2. Interrupt: 포지션 설명
            {
                type: 'interrupt',
                title: '🪑 포지션이란?',
                content: `
                    <div style="text-align: left; line-height: 1.8;">
                        <p><strong style="color: #f1c40f;">BTN (버튼/딜러)</strong><br/>
                        가장 유리한 자리. 마지막에 행동합니다.</p>

                        <p><strong style="color: #e74c3c;">SB (스몰 블라인드)</strong><br/>
                        강제로 작은 금액을 냅니다. ($50)</p>

                        <p><strong style="color: #e74c3c;">BB (빅 블라인드)</strong><br/>
                        강제로 큰 금액을 냅니다. ($100)<br/>
                        <em>→ 지금 당신의 자리!</em></p>

                        <p><strong style="color: #3498db;">UTG (언더 더 건)</strong><br/>
                        가장 먼저 행동해야 하는 불리한 자리.</p>
                    </div>
                `
            },

            // 3. 카드 딜링
            { type: 'deal', description: '모든 플레이어에게 카드 2장씩' },

            // 4. 블라인드 포스팅
            { type: 'blinds', pot: 150, description: 'SB $50 + BB $100 = $150' },

            // 5. UTG 폴드
            { type: 'action', player: 'UTG', action: 'FOLD', description: 'UTG가 폴드합니다' },

            // 6. HJ 콜
            { type: 'action', player: 'HJ', action: 'CALL', pot: 250, description: 'HJ가 $100 콜' },

            // 7. CO, BTN 폴드
            { type: 'action', player: 'CO', action: 'FOLD', description: 'CO 폴드' },
            { type: 'action', player: 'BTN', action: 'FOLD', description: 'BTN 폴드' },

            // 8. SB 콜
            { type: 'action', player: 'SB', action: 'CALL', pot: 300, description: 'SB가 $50 추가 콜' },

            // 9. 당신의 차례!
            { type: 'your_turn', description: '당신의 차례입니다!' },

            // 10. Interrupt: 액션 설명
            {
                type: 'interrupt',
                title: '🎯 무엇을 할 수 있나요?',
                content: `
                    <div style="text-align: left; line-height: 1.8;">
                        <p><strong style="color: #e74c3c;">FOLD (폴드)</strong><br/>
                        포기합니다. 낸 돈은 잃지만 더 이상 잃지 않습니다.</p>

                        <p><strong style="color: #3498db;">CHECK (체크)</strong><br/>
                        BB는 이미 $100을 냈으므로, 추가 베팅 없이 넘길 수 있습니다.</p>

                        <p><strong style="color: #27ae60;">RAISE (레이즈)</strong><br/>
                        베팅을 올립니다. 다른 플레이어들이 더 내야 합니다.</p>

                        <p style="margin-top: 20px; padding: 10px; background: rgba(241,196,99,0.2); border-radius: 8px;">
                            💡 <strong>A♥ 7♠</strong>는 괜찮은 핸드!<br/>
                            체크하고 플랍을 보는 게 좋겠습니다.
                        </p>
                    </div>
                `
            },

            // 11. BB 체크
            { type: 'action', player: 'BB', action: 'CHECK', description: '체크합니다' },

            // 12. 플랍!
            {
                type: 'flop',
                cards: [
                    { suit: '♥', rank: 'K', color: 'red' },
                    { suit: '♦', rank: '7', color: 'red' },
                    { suit: '♣', rank: '2', color: 'black' }
                ],
                description: '플랍: K♥ 7♦ 2♣'
            },

            // 13. Interrupt: 플랍 설명
            {
                type: 'interrupt',
                title: '🃏 플랍 (Flop)',
                content: `
                    <div style="text-align: left; line-height: 1.8;">
                        <p>커뮤니티 카드 3장이 공개되었습니다!</p>

                        <p><strong>보드:</strong> K♥ 7♦ 2♣</p>
                        <p><strong>내 핸드:</strong> A♥ 7♠</p>

                        <p style="margin-top: 20px; padding: 15px; background: rgba(39,174,96,0.2); border-radius: 8px;">
                            🎉 <strong>페어!</strong><br/>
                            7♦와 내 7♠로 원페어 완성!
                        </p>

                        <p style="margin-top: 15px; color: #7f8c8d;">
                            이제 턴(Turn)과 리버(River)에서<br/>
                            카드가 한 장씩 더 공개됩니다.
                        </p>
                    </div>
                `
            },

            // 14. 턴
            {
                type: 'turn',
                card: { suit: '♠', rank: '3', color: 'black' },
                description: '턴: 3♠'
            },

            // 15. Interrupt: 턴 설명
            {
                type: 'interrupt',
                title: '🃏 턴 (Turn)',
                content: `
                    <div style="text-align: left; line-height: 1.8;">
                        <p>네 번째 커뮤니티 카드가 공개되었습니다.</p>

                        <p><strong>보드:</strong> K♥ 7♦ 2♣ 3♠</p>

                        <p>여전히 세븐 원페어를 들고 있습니다.</p>
                    </div>
                `
            },

            // 16. 리버
            {
                type: 'river',
                card: { suit: '♥', rank: 'A', color: 'red' },
                description: '리버: A♥'
            },

            // 17. Interrupt: 리버 + 결과
            {
                type: 'interrupt',
                title: '🎊 투페어 완성!',
                content: `
                    <div style="text-align: left; line-height: 1.8;">
                        <p><strong>최종 보드:</strong> K♥ 7♦ 2♣ 3♠ A♥</p>
                        <p><strong>내 핸드:</strong> A♥ 7♠</p>

                        <p style="margin-top: 20px; padding: 15px; background: rgba(241,196,99,0.3); border-radius: 8px;">
                            🏆 <strong>에이스-세븐 투페어!</strong><br/>
                            A + A♥ (보드) = 에이스 페어<br/>
                            7♠ + 7♦ (보드) = 세븐 페어
                        </p>

                        <p style="margin-top: 20px; text-align: center; font-size: 1.2em;">
                            이것이 한 판의 홀덤입니다! 🎴
                        </p>
                    </div>
                `
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

// 6-handed table positions (clockwise from top)
// Dealing order: SB → BB → UTG → HJ → CO → BTN
const playerPositions = [
    { id: 1, position: 'CO', name: 'CO', chips: 5000, dealOrder: 5, style: { top: '-80px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 2, position: 'BTN', name: 'BTN', chips: 7500, dealOrder: 6, style: { top: '60px', right: '-100px' } },
    { id: 3, position: 'SB', name: 'SB', chips: 4200, dealOrder: 1, style: { bottom: '60px', right: '-100px' } },
    { id: 4, position: 'BB', name: 'YOU (BB)', chips: 6000, dealOrder: 2, isYou: true, style: { bottom: '-80px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 5, position: 'UTG', name: 'UTG', chips: 3800, dealOrder: 3, style: { bottom: '60px', left: '-100px' } },
    { id: 6, position: 'HJ', name: 'HJ', chips: 5500, dealOrder: 4, style: { top: '60px', left: '-100px' } },
]

// Position colors
const positionColors = {
    BTN: '#f1c40f',  // Gold - Dealer
    SB: '#e74c3c',   // Red
    BB: '#e74c3c',   // Red
    UTG: '#3498db',  // Blue - Early
    HJ: '#9b59b6',   // Purple - Middle
    CO: '#27ae60',   // Green - Late
}

// Your cards
const yourCards = [
    { suit: '♥', rank: 'A', color: 'red' },
    { suit: '♠', rank: '7', color: 'black' }
]

function Card({ card, dealOrder = 0, isFolded = false, isHidden = true }) {
    // Deal cards based on position order (SB first, then BB, UTG, etc.)
    const delay = dealOrder * 0.15

    return (
        <motion.div
            className={`card ${card?.color || ''} ${isFolded ? 'folded' : ''}`}
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
            {!isHidden && card && `${card.rank}${card.suit}`}
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

function Player({ player, step, cardsDealt }) {
    const showCards = cardsDealt && step >= 2
    // UTG folds first (after blinds posted), then HJ calls
    const showAction = (player.position === 'UTG' && step >= 3) || (player.position === 'HJ' && step >= 4)
    const isFolded = player.position === 'UTG' && step >= 3

    const cards = player.isYou ? yourCards : [null, null]
    const positionColor = positionColors[player.position]

    return (
        <motion.div
            className={`player ${player.isYou ? 'you' : ''}`}
            style={player.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: player.id * 0.1 }}
        >
            <div className="player-cards">
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
            <div
                className="player-avatar position-badge"
                style={{
                    background: positionColor,
                    border: player.position === 'BTN' ? '3px solid #fff' : 'none',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
            >
                {player.position}
            </div>
            <div className="player-info">
                <div className="player-name" style={player.isYou ? { color: positionColor } : {}}>
                    {player.isYou ? 'YOU' : player.position}
                </div>
                <div className="player-chips">${player.chips.toLocaleString()}</div>
            </div>
            <AnimatePresence>
                {player.position === 'UTG' && step >= 3 && (
                    <ActionIndicator action="FOLD" delay={0} />
                )}
                {player.position === 'HJ' && step >= 4 && (
                    <ActionIndicator action="CALL" delay={0} />
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

function ExplanationOverlay({ description = '당신의 차례입니다' }) {
    return (
        <motion.div
            className="explanation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="explanation-content">
                <motion.div
                    className="explanation-title"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {description}
                </motion.div>
                <motion.div
                    className="explanation-text"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    A♥ 7♠를 들고 있습니다.<br /><br />
                    <strong>선택지:</strong><br />
                    Fold / Call $100 / Raise
                </motion.div>
            </div>
        </motion.div>
    )
}

// Interrupt Overlay - 튜토리얼 설명 패널
function InterruptOverlay({ title, content }) {
    return (
        <motion.div
            className="interrupt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="interrupt-panel"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                <div className="interrupt-title">{title}</div>
                <div
                    className="interrupt-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="interrupt-hint">
                    Space / → 를 눌러 계속
                </div>
            </motion.div>
        </motion.div>
    )
}

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

    // Check if current step is interrupt
    const isInterrupt = currentStepData.type === 'interrupt'

    // Determine current game phase
    let currentPhase = 'preflop'
    for (let i = 0; i <= step; i++) {
        const s = scenario.steps[i]
        if (s?.type === 'flop') currentPhase = 'flop'
        else if (s?.type === 'turn') currentPhase = 'turn'
        else if (s?.type === 'river') currentPhase = 'river'
    }

    // Embed mode: hide controls, show only table
    if (urlParams.embed) {
        return (
            <div className="container embed-mode">
                <div className="poker-table">
                    <div className="table-rail" />
                    <div className="table-felt" />
                    <GamePhase currentPhase={currentPhase} />
                    {step >= 1 && playerPositions.map(player => (
                        <Player key={player.id} player={player} step={step} cardsDealt={step >= 2} />
                    ))}
                    {step >= 1 && (
                        <motion.div className="dealer-button" style={{ bottom: '90px', left: 'calc(50% + 80px)' }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
                            D
                        </motion.div>
                    )}
                    {step >= 2 && <Pot amount={potAmount} />}
                    <div className="community-cards">
                        {communityCards.map((card, i) => (
                            <motion.div
                                key={i}
                                className={`community-card ${card.color}`}
                                initial={{ opacity: 0, y: -50, rotateY: 180 }}
                                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.4, type: 'spring' }}
                            >
                                {card.rank}{card.suit}
                            </motion.div>
                        ))}
                    </div>
                    <AnimatePresence>
                        {currentStepData.type === 'your_turn' && <ExplanationOverlay description={currentStepData.description} />}
                        {isInterrupt && (
                            <InterruptOverlay
                                title={currentStepData.title}
                                content={currentStepData.content}
                            />
                        )}
                    </AnimatePresence>
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

            <div className="poker-table">
                <div className="table-rail" />
                <div className="table-felt" />

                <GamePhase currentPhase={currentPhase} />

                {step >= 1 && playerPositions.map(player => (
                    <Player
                        key={player.id}
                        player={player}
                        step={step}
                        cardsDealt={step >= 2}
                    />
                ))}

                {step >= 1 && (
                    <motion.div
                        className="dealer-button"
                        style={{ bottom: '90px', left: 'calc(50% + 80px)' }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        D
                    </motion.div>
                )}

                {step >= 2 && <Pot amount={potAmount} />}

                <div className="community-cards">
                    {communityCards.map((card, i) => (
                        <motion.div
                            key={i}
                            className={`community-card ${card.color}`}
                            initial={{ opacity: 0, y: -50, rotateY: 180 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.4, type: 'spring' }}
                        >
                            {card.rank}{card.suit}
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {currentStepData.type === 'your_turn' && (
                        <ExplanationOverlay description={currentStepData.description} />
                    )}
                    {isInterrupt && (
                        <InterruptOverlay
                            title={currentStepData.title}
                            content={currentStepData.content}
                        />
                    )}
                </AnimatePresence>

                <StepIndicator step={step} totalSteps={totalSteps} />
            </div>
        </div>
    )
}
