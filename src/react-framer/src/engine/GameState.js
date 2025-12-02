import { parsePHH } from '../phhParser';

// ===========================================
// BUILT-IN DEMO SCENARIO (for development/testing only)
// Production use: pass scenario via mount options
// ===========================================

const DEMO_SCENARIO = {
    name: 'Demo: Empty Table',
    yourPosition: 'BB',
    yourCards: [
        { suit: '♥', rank: 'A', color: 'red' },
        { suit: '♠', rank: 'K', color: 'black' }
    ],
    steps: [
        { type: 'setup', description: '테이블 셋업' },
        { type: 'deal', description: '카드 딜링' },
    ]
};

// ===========================================
// GAME STATE CLASS - 상태 관리
// ===========================================

export class GameState {
    /**
     * @param {Object} options
     * @param {Object} [options.scenario] - 시나리오 객체 직접 전달
     * @param {string} [options.phh] - PHH 문자열 (파싱하여 시나리오로 변환)
     */
    constructor(options = {}) {
        // 시나리오 결정 우선순위: scenario 객체 > phh 문자열 > 데모 시나리오
        if (options.scenario) {
            this.scenario = options.scenario;
            this.scenarioKey = options.scenario.name || 'custom';
        } else if (options.phh) {
            this.scenario = parsePHH(options.phh);
            this.scenarioKey = 'phh';
        } else {
            this.scenario = DEMO_SCENARIO;
            this.scenarioKey = 'demo';
        }

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

    /**
     * 새 시나리오 로드
     * @param {Object} options - { scenario: {...} } 또는 { phh: "..." }
     */
    loadScenario(options) {
        if (options.scenario) {
            this.scenario = options.scenario;
            this.scenarioKey = options.scenario.name || 'custom';
        } else if (options.phh) {
            this.scenario = parsePHH(options.phh);
            this.scenarioKey = 'phh';
        }
        this.step = 0;
        this._notify();
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

        // 팟 금액 - 현재 스텝까지의 최신 pot 값 찾기
        let pot = 0;
        for (let i = 0; i <= this.step; i++) {
            const s = this.scenario.steps[i];
            if (s?.pot !== undefined) {
                pot = s.pot;
            }
        }

        // 중앙에 모인 팟 (페이즈 전환 시점까지만)
        // - flop/turn/river 스텝에서 직전 pot 값
        // - showdown/winner 스텝에서는 전체 pot
        let collectedPot = 0;
        for (let i = 0; i <= this.step; i++) {
            const s = this.scenario.steps[i];
            // 페이즈 전환(flop/turn/river) 또는 쇼다운/위너 시점에서 pot 업데이트
            if (s?.type === 'flop' || s?.type === 'turn' || s?.type === 'river' ||
                s?.type === 'showdown' || s?.type === 'winner') {
                // 직전 스텝의 pot 값 (현재 스텝 포함)
                if (s?.pot !== undefined) {
                    collectedPot = s.pot;
                }
            }
        }

        return {
            scenarioKey: this.scenarioKey,
            scenarioName: this.scenario.name,
            step: this.step,
            totalSteps: this.scenario.steps.length,
            currentStepData,
            phase,
            pot,
            collectedPot,
            communityCards,
            yourCards: this.scenario.yourCards,
            yourPosition: this.scenario.yourPosition,
            // 쇼다운/위너 시 다른 플레이어 카드
            playerCards: this.scenario.playerCards,
        };
    }
}

export default GameState;
