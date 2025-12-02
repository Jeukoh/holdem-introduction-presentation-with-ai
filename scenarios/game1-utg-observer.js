/**
 * Part 2.2 - 1판: UTG 관찰자 모드
 * 72o로 폴드 → 3bet/4bet 관전 → 투페어였으면 이겼는데 아쉬움!
 */
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS.game1_utg_observer = {
    name: '1판: UTG - 관찰자 모드',
    yourPosition: 'UTG',
    yourCards: [
        { suit: '♦', rank: '7', color: 'red' },
        { suit: '♣', rank: '2', color: 'black' }
    ],
    // 다른 플레이어 카드 (쇼다운용)
    playerCards: {
        HJ: [{ suit: '♦', rank: '10', color: 'red' }, { suit: '♣', rank: '9', color: 'black' }],
        CO: [{ suit: '♠', rank: 'A', color: 'black' }, { suit: '♦', rank: 'K', color: 'red' }],
        BTN: [{ suit: '♣', rank: 'Q', color: 'black' }, { suit: '♥', rank: 'J', color: 'red' }],
        SB: [{ suit: '♥', rank: '5', color: 'red' }, { suit: '♣', rank: '4', color: 'black' }],
        BB: [{ suit: '♠', rank: 'Q', color: 'black' }, { suit: '♠', rank: '8', color: 'black' }],
    },
    bbSize: 1,
    steps: [
        // 셋업
        { type: 'setup', description: '테이블 셋업' },
        { type: 'position_modal', description: '포지션 설명' },
        // 블라인드 - 0.5BB / 1BB
        { type: 'blinds', pot: 1.5, bets: { SB: 0.5, BB: 1 }, description: 'SB 0.5BB, BB 1BB' },
        // 딜링
        { type: 'deal', description: '카드 딜링' },
        // ===== 프리플랍 - 3bet/4bet 포함 =====
        { type: 'your_turn', player: 'UTG', pot: 1.5, description: '내 차례! 뭐지?' },
        { type: 'action', player: 'UTG', action: 'FOLD', bet: 0, pot: 1.5, description: '72o... 최악의 핸드. 폴드!' },
        { type: 'action_modal', description: '베팅 액션 설명' },
        { type: 'action', player: 'HJ', action: 'FOLD', bet: 0, pot: 1.5, description: 'HJ 폴드' },
        { type: 'action', player: 'CO', action: 'RAISE', bet: 3, pot: 4.5, description: 'CO 레이즈 3BB' },
        { type: 'action', player: 'BTN', action: 'RAISE', bet: 9, pot: 13.5, description: 'BTN 3-bet! 9BB' },
        { type: 'action', player: 'SB', action: 'FOLD', bet: 0, pot: 13.5, description: 'SB 폴드' },
        { type: 'action', player: 'BB', action: 'FOLD', bet: 0, pot: 13.5, description: 'BB 폴드' },
        { type: 'action', player: 'CO', action: 'RAISE', bet: 25, pot: 38.5, description: 'CO 4-bet! 28BB' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 19, pot: 57.5, description: 'BTN 콜 (+19BB)' },
        // ===== 플랍 =====
        // 보드: K♠ 7♥ 2♦ → 내가 투페어였는데...!
        {
            type: 'flop',
            cards: [
                { suit: '♠', rank: 'K', color: 'black' },
                { suit: '♥', rank: '7', color: 'red' },
                { suit: '♦', rank: '2', color: 'red' }
            ],
            pot: 57.5,
            description: '플랍: K♠ 7♥ 2♦'
        },
        { type: 'action', player: 'CO', action: 'BET', bet: 25, pot: 82.5, description: 'CO C-bet 25BB' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 25, pot: 107.5, description: 'BTN 콜' },
        // ===== 턴 =====
        {
            type: 'turn',
            card: { suit: '♣', rank: 'J', color: 'black' },
            pot: 107.5,
            description: '턴: J♣'
        },
        { type: 'action', player: 'CO', action: 'BET', bet: 50, pot: 157.5, description: 'CO 벳 50BB' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 50, pot: 207.5, description: 'BTN 콜 (J 페어!)' },
        // ===== 리버 =====
        {
            type: 'river',
            card: { suit: '♠', rank: '9', color: 'black' },
            pot: 207.5,
            description: '리버: 9♠'
        },
        { type: 'action', player: 'CO', action: 'CHECK', bet: 0, pot: 207.5, description: 'CO 체크' },
        { type: 'action', player: 'BTN', action: 'BET', bet: 75, pot: 282.5, description: 'BTN 벳 75BB (블러프?)' },
        { type: 'action', player: 'CO', action: 'CALL', bet: 75, pot: 357.5, description: 'CO 콜 (캐치!)' },
        // ===== 쇼다운 =====
        { type: 'showdown', pot: 357.5, description: '쇼다운!' },
        { type: 'winner', winner: 'CO', hand: 'K 원페어 (A 키커)', pot: 357.5, description: 'CO 승리! K 원페어가 J 원페어를 이김' },
    ]
};
