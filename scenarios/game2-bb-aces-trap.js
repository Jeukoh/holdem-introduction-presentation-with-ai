/**
 * Part 2.2 - 2판: BB에서 AA - 슬로우플레이의 함정
 * AA로 콜만 → 멀티웨이 → 보드에서 역전당함
 * 교훈: 프리미엄 핸드는 레이즈로 팟을 줄여라!
 */
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS.game2_bb_aces_trap = {
    name: '2판: BB - AA의 함정',
    yourPosition: 'BB',
    yourCards: [
        { suit: '♠', rank: 'A', color: 'black' },
        { suit: '♥', rank: 'A', color: 'red' }
    ],
    // 다른 플레이어 카드 (쇼다운용)
    // CO: 9♣4♣ → 보드 8-7-6-5 + 9로 9-하이 스트레이트!
    playerCards: {
        UTG: [{ suit: '♦', rank: 'K', color: 'red' }, { suit: '♣', rank: 'J', color: 'black' }],
        HJ: [{ suit: '♣', rank: 'K', color: 'black' }, { suit: '♠', rank: 'Q', color: 'black' }],
        CO: [{ suit: '♣', rank: '9', color: 'black' }, { suit: '♣', rank: '4', color: 'black' }],
        BTN: [{ suit: '♠', rank: 'J', color: 'black' }, { suit: '♥', rank: '10', color: 'red' }],
        SB: [{ suit: '♦', rank: '4', color: 'red' }, { suit: '♥', rank: '3', color: 'red' }],
    },
    bbSize: 1,
    steps: [
        // 셋업
        { type: 'setup', description: '테이블 셋업' },
        // 블라인드
        { type: 'blinds', pot: 1.5, bets: { SB: 0.5, BB: 1 }, description: 'SB 0.5BB, BB 1BB' },
        // 딜링
        { type: 'deal', description: '카드 딜링' },
        // 프리플랍 - CO 오픈, 여러명 콜
        { type: 'your_turn', player: 'BB', pot: 1.5, description: 'AA! 최고의 핸드!' },
        { type: 'action', player: 'UTG', action: 'FOLD', bet: 0, pot: 1.5, description: 'UTG 폴드' },
        { type: 'action', player: 'HJ', action: 'RAISE', bet: 3, pot: 4.5, description: 'HJ 오픈 3BB' },
        { type: 'action', player: 'CO', action: 'CALL', bet: 3, pot: 7.5, description: 'CO 콜' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 3, pot: 10.5, description: 'BTN 콜' },
        { type: 'action', player: 'SB', action: 'FOLD', bet: 0, pot: 10.5, description: 'SB 폴드' },
        // BB(나)의 결정 - 콜만 함 (실수!)
        { type: 'decision_point', player: 'BB', pot: 10.5, description: '3-bet? 아니면 콜?' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 2, pot: 12.5, description: 'BB 콜 (+2BB)... 슬로우플레이!' },
        // 플랍 - 위험한 보드
        // 보드: 8♥ 7♠ 6♣ → 스트레이트 가능 보드!
        {
            type: 'flop',
            cards: [
                { suit: '♥', rank: '8', color: 'red' },
                { suit: '♠', rank: '7', color: 'black' },
                { suit: '♣', rank: '6', color: 'black' }
            ],
            pot: 12.5,
            description: '플랍: 8♥ 7♠ 6♣ - 위험한 보드!'
        },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 12.5, description: 'BB 체크 (AA인데...)' },
        { type: 'action', player: 'HJ', action: 'BET', bet: 8, pot: 20.5, description: 'HJ C-bet 8BB' },
        { type: 'action', player: 'CO', action: 'CALL', bet: 8, pot: 28.5, description: 'CO 콜 (뭔가 있나?)' },
        { type: 'action', player: 'BTN', action: 'FOLD', bet: 0, pot: 28.5, description: 'BTN 폴드' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 8, pot: 36.5, description: 'BB 콜 (AA니까...)' },
        // 턴 - 더 위험해짐
        {
            type: 'turn',
            card: { suit: '♦', rank: '5', color: 'red' },
            pot: 36.5,
            description: '턴: 5♦ - 4-5-6-7-8 스트레이트 완성!'
        },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 36.5, description: 'BB 체크 (불안...)' },
        { type: 'action', player: 'HJ', action: 'CHECK', bet: 0, pot: 36.5, description: 'HJ 체크' },
        { type: 'action', player: 'CO', action: 'BET', bet: 25, pot: 61.5, description: 'CO 벳 25BB!' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 25, pot: 86.5, description: 'BB 콜 (포기 못해...)' },
        { type: 'action', player: 'HJ', action: 'FOLD', bet: 0, pot: 86.5, description: 'HJ 폴드' },
        // 리버
        {
            type: 'river',
            card: { suit: '♠', rank: 'K', color: 'black' },
            pot: 86.5,
            description: '리버: K♠'
        },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 86.5, description: 'BB 체크' },
        { type: 'action', player: 'CO', action: 'BET', bet: 50, pot: 136.5, description: 'CO 올인 50BB!' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 50, pot: 186.5, description: 'BB 콜... (히어로콜?)' },
        // 쇼다운
        { type: 'showdown', pot: 186.5, description: '쇼다운!' },
        { type: 'winner', winner: 'CO', hand: '9-하이 스트레이트 (5-6-7-8-9)', pot: 186.5, description: 'CO 승리! 94로 스트레이트!' },
        // 교훈
        { type: 'lesson', description: 'AA는 프리플랍에서 3-bet으로 팟을 줄여야 했다!' }
    ]
};
