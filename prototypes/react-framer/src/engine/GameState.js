import { parsePHH, examplePHH } from '../phhParser';

// ===========================================
// SCENARIOS - 게임 시나리오 정의
// ===========================================

const phhScenario = parsePHH(examplePHH);

export const scenarios = {
    phh: phhScenario,

    tutorial: {
        name: '🎓 Tutorial: 한 판의 홀덤',
        yourPosition: 'BB',
        yourCards: [
            { suit: '♥', rank: 'A', color: 'red' },
            { suit: '♠', rank: '7', color: 'black' }
        ],
        steps: [
            { type: 'setup', description: '테이블 셋업' },
            { type: 'deal', description: '카드 딜링' },
            { type: 'blinds', pot: 150, description: 'SB $50 + BB $100' },
            { type: 'action', player: 'UTG', action: 'FOLD', pot: 150, description: 'UTG 폴드' },
            { type: 'action', player: 'HJ', action: 'CALL', pot: 250, description: 'HJ $100 콜' },
            { type: 'action', player: 'CO', action: 'FOLD', pot: 250, description: 'CO 폴드' },
            { type: 'action', player: 'BTN', action: 'FOLD', pot: 250, description: 'BTN 폴드' },
            { type: 'action', player: 'SB', action: 'CALL', pot: 300, description: 'SB $50 콜' },
            { type: 'action', player: 'BB', action: 'CHECK', pot: 300, description: 'BB 체크' },
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
            {
                type: 'turn',
                card: { suit: '♠', rank: '3', color: 'black' },
                pot: 300,
                description: '턴: 3♠'
            },
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
};

// ===========================================
// GAME STATE CLASS - 상태 관리
// ===========================================

export class GameState {
    constructor(scenarioKey = 'tutorial') {
        this.scenarioKey = scenarioKey;
        this.scenario = scenarios[scenarioKey] || scenarios.tutorial;
        this.step = 0;
        this.listeners = new Set();
    }

    // 상태 변경 알림
    _notify() {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    // 구독
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // 다음 스텝
    nextStep() {
        const maxStep = this.scenario.steps.length - 1;
        if (this.step < maxStep) {
            this.step++;
            this._notify();
        }
        return this.step;
    }

    // 이전 스텝
    prevStep() {
        if (this.step > 0) {
            this.step--;
            this._notify();
        }
        return this.step;
    }

    // 특정 스텝으로 이동
    goToStep(n) {
        const maxStep = this.scenario.steps.length - 1;
        const newStep = Math.max(0, Math.min(n, maxStep));
        if (this.step !== newStep) {
            this.step = newStep;
            this._notify();
        }
        return this.step;
    }

    // 리셋
    reset() {
        this.step = 0;
        this._notify();
    }

    // 시나리오 변경
    setScenario(scenarioKey) {
        if (scenarios[scenarioKey]) {
            this.scenarioKey = scenarioKey;
            this.scenario = scenarios[scenarioKey];
            this.step = 0;
            this._notify();
        }
    }

    // 현재 상태 조회
    getState() {
        const currentStepData = this.scenario.steps[this.step] || {};

        // 커뮤니티 카드 수집
        const communityCards = [];
        for (let i = 0; i <= this.step; i++) {
            const s = this.scenario.steps[i];
            if (s?.type === 'flop' && s.cards) {
                communityCards.push(...s.cards);
            } else if ((s?.type === 'turn' || s?.type === 'river') && s.card) {
                communityCards.push(s.card);
            }
        }

        // 현재 게임 단계 판단
        let phase = 'preflop';
        for (let i = 0; i <= this.step; i++) {
            const s = this.scenario.steps[i];
            if (s?.type === 'flop') phase = 'flop';
            else if (s?.type === 'turn') phase = 'turn';
            else if (s?.type === 'river') phase = 'river';
        }

        // 팟 금액
        const pot = currentStepData.pot || (this.step >= 2 ? 150 : 0);

        return {
            scenarioKey: this.scenarioKey,
            scenarioName: this.scenario.name,
            step: this.step,
            totalSteps: this.scenario.steps.length,
            currentStepData,
            phase,
            pot,
            communityCards,
            yourCards: this.scenario.yourCards,
            yourPosition: this.scenario.yourPosition,
        };
    }

    // 시나리오 목록 조회
    static getScenarios() {
        return Object.keys(scenarios).map(key => ({
            key,
            name: scenarios[key].name
        }));
    }
}

export default GameState;
