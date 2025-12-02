/**
 * Part 2.2 - 2판: BB에서 AA - 슬로우플레이의 함정
 * AA로 체크/콜만 → 멀티웨이 → 스트레이트에 역전당함
 * 교훈: 프리미엄 핸드는 레이즈로 필드를 줄여라!
 */
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS.game2_bb_aces_trap = {
    name: '2판: BB - AA의 함정',
    yourPosition: 'BB',
    yourCards: [
        { suit: '♠', rank: 'A', color: 'black' },
        { suit: '♥', rank: 'A', color: 'red' }
    ],
    // 다른 플레이어 카드 (쇼다운/리빌용)
    // CO: 9♠4♠ → 보드 8-7-6-5-K에서 9-8-7-6-5 스트레이트!
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
        // 블라인드
        { type: 'blinds', pot: 1.5, bets: { SB: 0.5, BB: 1 }, description: 'SB 0.5BB, BB 1BB' },
        // 딜링
        { type: 'deal', description: '카드 딜링' },

        // ===== 프리플랍 - 림프 파티! (많이 참여) =====
        { type: 'action', player: 'UTG', action: 'CALL', bet: 1, pot: 2.5, description: 'UTG 림프' },
        { type: 'action', player: 'HJ', action: 'CALL', bet: 1, pot: 3.5, description: 'HJ 림프' },
        { type: 'action', player: 'CO', action: 'CALL', bet: 1, pot: 4.5, description: 'CO 림프' },
        { type: 'action', player: 'BTN', action: 'CALL', bet: 1, pot: 5.5, description: 'BTN 림프' },
        { type: 'action', player: 'SB', action: 'CALL', bet: 0.5, pot: 6, description: 'SB 콜' },

        // BB(나)의 결정 - AA인데 체크만 함 (실수!)
        { type: 'your_turn', player: 'BB', pot: 6, description: 'AA! 최고의 핸드가 왔다!' },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 6, description: 'BB 체크... (슬로우플레이?)' },

        // ===== 플랍 - 위험한 보드 =====
        // 보드: 8♥ 7♠ 6♣ → 스트레이트 드로우 천국!
        {
            type: 'flop',
            cards: [
                { suit: '♥', rank: '8', color: 'red' },
                { suit: '♠', rank: '7', color: 'black' },
                { suit: '♣', rank: '6', color: 'black' }
            ],
            pot: 6,
            description: '플랍: 8♥ 7♠ 6♣ - 커넥티드 보드!'
        },
        // 위험한 보드라 모두 체크
        { type: 'action', player: 'SB', action: 'CHECK', bet: 0, pot: 6, description: 'SB 체크' },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 6, description: 'BB 체크 (무서운 보드...)' },
        { type: 'action', player: 'UTG', action: 'CHECK', bet: 0, pot: 6, description: 'UTG 체크' },
        { type: 'action', player: 'HJ', action: 'CHECK', bet: 0, pot: 6, description: 'HJ 체크 (QQ지만 무섭다)' },
        { type: 'action', player: 'CO', action: 'CHECK', bet: 0, pot: 6, description: 'CO 체크 (아직 아무것도 없음)' },
        { type: 'action', player: 'BTN', action: 'CHECK', bet: 0, pot: 6, description: 'BTN 체크' },

        // ===== 턴 =====
        // 5♦ → CO의 9가 스트레이트 완성! (5-6-7-8-9)
        {
            type: 'turn',
            card: { suit: '♦', rank: '5', color: 'red' },
            pot: 6,
            description: '턴: 5♦'
        },
        { type: 'action', player: 'SB', action: 'CHECK', bet: 0, pot: 6, description: 'SB 체크' },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 6, description: 'BB 체크 (여전히 불안...)' },
        { type: 'action', player: 'UTG', action: 'CHECK', bet: 0, pot: 6, description: 'UTG 체크' },
        { type: 'action', player: 'HJ', action: 'CHECK', bet: 0, pot: 6, description: 'HJ 체크' },
        { type: 'action', player: 'CO', action: 'BET', bet: 4, pot: 10, description: 'CO 벳 4BB (스트레이트 완성!)' },
        { type: 'action', player: 'BTN', action: 'FOLD', bet: 0, pot: 10, description: 'BTN 폴드' },
        { type: 'action', player: 'SB', action: 'FOLD', bet: 0, pot: 10, description: 'SB 폴드' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 4, pot: 14, description: 'BB 콜 (AA니까...)' },
        { type: 'action', player: 'UTG', action: 'FOLD', bet: 0, pot: 14, description: 'UTG 폴드' },
        { type: 'action', player: 'HJ', action: 'CALL', bet: 4, pot: 18, description: 'HJ 콜 (QQ... 한번만 더)' },

        // ===== 리버 =====
        {
            type: 'river',
            card: { suit: '♠', rank: 'K', color: 'black' },
            pot: 18,
            description: '리버: K♠'
        },
        { type: 'action', player: 'BB', action: 'CHECK', bet: 0, pot: 18, description: 'BB 체크' },
        { type: 'action', player: 'HJ', action: 'CHECK', bet: 0, pot: 18, description: 'HJ 체크' },
        { type: 'action', player: 'CO', action: 'BET', bet: 12, pot: 30, description: 'CO 벳 12BB (밸류!)' },
        { type: 'action', player: 'BB', action: 'CALL', bet: 12, pot: 42, description: 'BB 콜... (AA잖아...)' },
        { type: 'action', player: 'HJ', action: 'FOLD', bet: 0, pot: 42, description: 'HJ 폴드 (QQ 포기)' },

        // ===== 쇼다운 =====
        { type: 'showdown', pot: 42, description: '쇼다운!' },
        { type: 'winner', winner: 'CO', hand: '9-하이 스트레이트 (5-6-7-8-9)', pot: 42, description: 'CO 승리! 94s로 스트레이트!' },

        // ===== 모든 핸드 공개 =====
        { type: 'reveal_all_hands', description: '다른 사람들은 뭐 들고 있었을까?' },

        // 교훈
        { type: 'lesson', title: '왜 졌을까?', description: '프리플랍에서 레이즈했으면 94s는 폴드했을 것!' }
    ]
};
