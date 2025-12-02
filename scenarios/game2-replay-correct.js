/**
 * Part 2.2 - 2판 리플레이: BB에서 AA - 이번엔 제대로!
 * 프리플랍에서 레이즈하면 어떻게 달라지는지 보여주기
 */
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS.game2_replay_correct = {
    name: '2판 리플레이: 이번엔 제대로!',
    yourPosition: 'BB',
    yourCards: [
        { suit: '♠', rank: 'A', color: 'black' },
        { suit: '♥', rank: 'A', color: 'red' }
    ],
    // 동일한 핸드 배분
    playerCards: {
        UTG: [{ suit: '♦', rank: 'K', color: 'red' }, { suit: '♣', rank: 'J', color: 'black' }],
        HJ: [{ suit: '♣', rank: 'Q', color: 'black' }, { suit: '♠', rank: 'Q', color: 'black' }],
        CO: [{ suit: '♠', rank: '9', color: 'black' }, { suit: '♠', rank: '4', color: 'black' }],
        BTN: [{ suit: '♥', rank: 'J', color: 'red' }, { suit: '♦', rank: '10', color: 'red' }],
        SB: [{ suit: '♦', rank: '3', color: 'red' }, { suit: '♣', rank: '2', color: 'black' }],
    },
    bbSize: 1,
    steps: [
        // 셋업
        { type: 'setup', description: '테이블 셋업' },
        { type: 'blinds', pot: 1.5, bets: { SB: 0.5, BB: 1 }, description: 'SB 0.5BB, BB 1BB' },
        { type: 'deal', description: '카드 딜링' },

        // ===== 프리플랍 - 동일한 림프 파티 =====
        { type: 'action', player: 'UTG', action: 'CALL', bet: 1, pot: 2.5, description: 'UTG 림프' },
        { type: 'action', player: 'HJ', action: 'CALL', bet: 1, pot: 3.5, description: 'HJ 림프' },
        { type: 'action', player: 'CO', action: 'CALL', bet: 1, pot: 4.5, description: 'CO 림프' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 1, pot: 5.5, description: 'BTN 림프' },
        { type: 'action', player: 'SB', action: 'CALL', bet: 0.5, pot: 6, description: 'SB 콜' },

        // BB 결정 포인트
        { type: 'your_turn', player: 'BB', pot: 6, description: '다시 같은 상황! 이번엔?' },

        // 승률 모달 - 왜 레이즈?
        {
            type: 'equity_modal',
            title: 'AA 승률',
            scenarios: [
                { situation: 'vs 1명', equity: 85, description: '압도적' },
                { situation: 'vs 2명', equity: 73, description: '좋음' },
                { situation: 'vs 5명 (지금)', equity: 49, description: '반반...' },
            ],
            conclusion: '상대가 많으면 AA도 위험해진다!',
            description: '레이즈로 상대를 줄이자'
        },

        // 이번엔 레이즈!
        { type: 'action', player: 'BB', action: 'RAISE', bet: 5, pot: 11, description: 'BB 레이즈 6BB!' },

        // 대부분 폴드
        { type: 'action', player: 'UTG', action: 'FOLD', bet: 0, pot: 11, description: 'UTG 폴드' },
        { type: 'action', player: 'HJ', action: 'CALL', bet: 5, pot: 16, description: 'HJ 콜 (QQ)' },
        { type: 'action', player: 'CO', action: 'FOLD', bet: 0, pot: 16, description: 'CO 폴드 (94s 탈락!)' },
        { type: 'action', player: 'BTN', action: 'FOLD', bet: 0, pot: 16, description: 'BTN 폴드' },
        { type: 'action', player: 'SB', action: 'FOLD', bet: 0, pot: 16, description: 'SB 폴드' },

        // 결과 비교
        {
            type: 'comparison_modal',
            title: '뭐가 달라졌나?',
            scenarios: [
                { name: '아까 (체크)', result: '6명', description: 'AA 승률 49%' },
                { name: '지금 (레이즈)', result: '2명', description: 'AA 승률 81%' },
            ],
            difference: '94s 탈락!',
            description: '스트레이트 위험 제거'
        },

        // Pot Odds 설명 - 왜 1BB는 콜, 6BB는 폴드?
        {
            type: 'pot_odds_modal',
            title: '왜 1BB는 콜, 6BB는 폴드?',
            extremeCases: [
                { potOdds: '0%', meaning: '투자금 = 0', decision: '무조건 콜', color: '#27ae60' },
                { potOdds: '50%', meaning: '투자 = 이득', decision: '50%+ 승률 필요', color: '#f1c40f' },
                { potOdds: '100%', meaning: '이득 = 0', decision: '의미 없음', color: '#e74c3c' },
            ],
            scenarios: [
                { situation: '림프 (1BB)', potOdds: 15, equity: 17, verdict: '+EV' },
                { situation: '레이즈 콜 (5BB)', potOdds: 31, equity: 17, verdict: '-EV' },
            ],
            conclusion: '가격이 오르면 같은 핸드도 -EV가 된다!',
            description: 'Pot Odds 공식으로 이해하기'
        },

        // CO가 따라왔으면? EV 계산
        {
            type: 'ev_modal',
            title: 'CO가 콜했다면?',
            potSize: 16,
            betSize: 5,
            scenarios: [
                { outcome: '이기면 (17%)', probability: 17, result: '+11BB' },
                { outcome: '지면 (83%)', probability: 83, result: '-5BB' },
            ],
            ev: '-2.3BB',
            conclusion: '림프는 거의 본전, 레이즈 콜은 큰 손해!',
            description: 'CO 입장에서 계산'
        },

        // 가볍게 마무리
        {
            type: 'lesson',
            title: '초심자 실수',
            points: [
                'AA를 받으면 흥분해서 슬로우플레이하기 쉬움',
                '하지만 상대가 많으면 뒤집힐 확률도 높아짐',
                '좋은 패일수록 과감하게!',
            ],
            description: ''
        }
    ]
};
