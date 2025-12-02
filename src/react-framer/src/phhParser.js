/**
 * PHH (Poker Hand History) Parser
 * Based on: https://arxiv.org/html/2312.11753v2
 *
 * Parses PHH notation and converts to scenario steps for React engine
 */

// Card parsing: "Ac" -> { rank: 'A', suit: '♣', color: 'black' }
const suitMap = {
    c: { symbol: '♣', color: 'black' },
    d: { symbol: '♦', color: 'red' },
    h: { symbol: '♥', color: 'red' },
    s: { symbol: '♠', color: 'black' },
    '?': { symbol: '?', color: 'gray' }
}

const rankMap = {
    'A': 'A', 'K': 'K', 'Q': 'Q', 'J': 'J', 'T': '10',
    '9': '9', '8': '8', '7': '7', '6': '6', '5': '5',
    '4': '4', '3': '3', '2': '2', '?': '?'
}

export function parseCard(cardStr) {
    if (!cardStr || cardStr.length < 2) return null
    const rank = rankMap[cardStr[0]] || cardStr[0]
    const suitInfo = suitMap[cardStr[1]] || suitMap['?']
    return {
        rank,
        suit: suitInfo.symbol,
        color: suitInfo.color
    }
}

// Parse cards string: "Ac2d" -> [{ rank: 'A', suit: '♣' }, { rank: '2', suit: '♦' }]
export function parseCards(cardsStr) {
    const cards = []
    for (let i = 0; i < cardsStr.length; i += 2) {
        const card = parseCard(cardsStr.slice(i, i + 2))
        if (card) cards.push(card)
    }
    return cards
}

// Action parsing
const actionMap = {
    'f': 'FOLD',
    'cc': 'CALL',
    'cbr': 'RAISE',
    'sm': 'SHOW'
}

export function parseAction(actionStr) {
    // Format: "p1 cbr 7000" or "p1 f" or "d dh p1 Ac2d"
    const parts = actionStr.trim().split(/\s+/)

    if (parts[0] === 'd') {
        // Dealer action
        if (parts[1] === 'dh') {
            // Deal hole cards: "d dh p1 Ac2d"
            const player = parts[2]
            const cards = parseCards(parts[3])
            return { type: 'deal', player, cards }
        } else if (parts[1] === 'db') {
            // Deal board: "d db Jc3d5c"
            const cards = parseCards(parts[2])
            return { type: 'board', cards }
        }
    } else if (parts[0].startsWith('p')) {
        // Player action
        const player = parseInt(parts[0].slice(1))
        const action = actionMap[parts[1]] || parts[1].toUpperCase()
        const amount = parts[2] ? parseInt(parts[2]) : null

        return { type: 'action', player, action, amount }
    }

    return null
}

// Position mapping for 6-max
const positionNames = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO']

// Parse full PHH and convert to scenario
export function parsePHH(phhText) {
    const lines = phhText.trim().split('\n')
    const scenario = {
        name: 'Parsed Hand',
        variant: 'NT',
        players: [],
        blinds: [0, 0],
        startingStacks: [],
        yourPosition: null,
        yourCards: [],
        communityCards: [],
        steps: [{ type: 'setup', description: '테이블 셋업' }]
    }

    let inActions = false
    const playerCards = {}
    const actions = []

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        // Parse key = value
        if (trimmed.includes('=') && !inActions) {
            const [key, ...valueParts] = trimmed.split('=')
            const keyTrim = key.trim()
            let value = valueParts.join('=').trim()

            // Remove quotes and brackets
            value = value.replace(/^["'\[]|["'\]]$/g, '')

            if (keyTrim === 'variant') {
                scenario.variant = value
            } else if (keyTrim === 'blinds_or_straddles') {
                scenario.blinds = value.split(',').map(v => parseInt(v.trim()))
            } else if (keyTrim === 'starting_stacks') {
                scenario.startingStacks = value.split(',').map(v => parseInt(v.trim()))
            } else if (keyTrim === 'actions') {
                inActions = true
            }
        }

        // Parse actions array items
        if (inActions && trimmed.startsWith('"')) {
            const actionStr = trimmed.replace(/^"|",?$/g, '')
            const parsed = parseAction(actionStr)
            if (parsed) {
                actions.push(parsed)
            }
        }
    }

    // Process actions into scenario steps
    let pot = scenario.blinds[0] + scenario.blinds[1]
    let dealComplete = false

    for (const action of actions) {
        if (action.type === 'deal') {
            playerCards[action.player] = action.cards
            if (!dealComplete && Object.keys(playerCards).length >= 2) {
                scenario.steps.push({
                    type: 'deal',
                    description: '카드 딜링',
                    playerCards
                })
                dealComplete = true
            }
        } else if (action.type === 'board') {
            const cardCount = action.cards.length
            const boardType = cardCount === 3 ? 'flop' : cardCount === 1 ? (
                scenario.communityCards.length === 3 ? 'turn' : 'river'
            ) : 'board'

            scenario.communityCards.push(...action.cards)
            scenario.steps.push({
                type: boardType,
                description: `${boardType.charAt(0).toUpperCase() + boardType.slice(1)} 오픈`,
                cards: action.cards
            })
        } else if (action.type === 'action') {
            const positionName = positionNames[(action.player - 1) % 6] || `P${action.player}`

            if (action.action === 'RAISE' || action.action === 'CALL') {
                pot += action.amount || 0
            }

            scenario.steps.push({
                type: 'action',
                player: positionName,
                action: action.action,
                amount: action.amount,
                pot,
                description: `${positionName} ${action.action}${action.amount ? ' $' + action.amount : ''}`
            })
        }
    }

    // Set hero cards (assume p1 is hero for now)
    if (playerCards['p1']) {
        scenario.yourCards = playerCards['p1']
        scenario.yourPosition = 'BB'  // Default
    }

    return scenario
}

// Example PHH for testing
export const examplePHH = `
# Example hand from WSOP 2023
variant = "NT"
blinds_or_straddles = [100, 200]
starting_stacks = [10000, 12000, 8000, 15000, 9000, 11000]
actions = [
    "d dh p1 Ah7s",
    "d dh p2 ????",
    "d dh p3 ????",
    "d dh p4 ????",
    "d dh p5 ????",
    "d dh p6 ????",
    "p4 f",
    "p5 cc",
    "p6 f",
    "p1 cc",
    "p2 cbr 600",
    "p3 f",
    "p5 cc",
    "p1 cc",
    "d db Kh9c2d",
    "p5 cc",
    "p1 cbr 1200",
    "p2 cc",
    "p5 f",
    "d db Jh",
    "p1 cbr 2400",
    "p2 cc",
    "d db 3c",
    "p1 cc",
    "p2 cc",
]
`

// Quick test
export function testParser() {
    const scenario = parsePHH(examplePHH)
    console.log('Parsed scenario:', scenario)
    return scenario
}
