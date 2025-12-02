import { motion, AnimatePresence } from 'framer-motion';

// ===========================================
// ACTION INFO MODAL - 베팅 액션 설명
// ===========================================

const ACTIONS_NO_BET = [
    {
        action: 'Check',
        emoji: '✋',
        desc: '패스 (베팅 없이 넘기기)',
        color: '#9b59b6',
    },
    {
        action: 'Bet',
        emoji: '💰',
        desc: '베팅 시작하기',
        color: '#e67e22',
    },
    {
        action: 'Fold',
        emoji: '🚫',
        desc: '카드 버리고 포기',
        color: '#e74c3c',
        note: '(체크 가능하면 폴드할 필요 없음)',
        dim: true,
    },
];

const ACTIONS_WITH_BET = [
    {
        action: 'Call',
        emoji: '📞',
        desc: '같은 금액 맞추기',
        color: '#3498db',
    },
    {
        action: 'Raise',
        emoji: '⬆️',
        desc: '더 올리기',
        color: '#27ae60',
    },
    {
        action: 'Fold',
        emoji: '🚫',
        desc: '카드 버리고 포기',
        color: '#e74c3c',
    },
];

export default function ActionInfoModal({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            borderRadius: 16,
                            padding: '24px 32px',
                            width: 560,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginBottom: 8,
                            textAlign: 'center',
                        }}>
                            🎲 베팅 액션
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: '#888',
                            marginBottom: 24,
                            textAlign: 'center',
                        }}>
                            내 차례에 할 수 있는 선택들
                        </div>

                        {/* 두 개의 컬럼 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 24,
                        }}>
                            {/* 왼쪽: 베팅 없을 때 */}
                            <div>
                                <div style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: '#9b59b6',
                                    marginBottom: 12,
                                    textAlign: 'center',
                                    padding: '8px 0',
                                    background: 'rgba(155, 89, 182, 0.15)',
                                    borderRadius: 8,
                                }}>
                                    앞에 베팅이 없을 때
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {ACTIONS_NO_BET.map((item, i) => (
                                        <motion.div
                                            key={item.action}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '10px 12px',
                                                borderRadius: 8,
                                                background: 'rgba(255,255,255,0.05)',
                                                opacity: item.dim ? 0.5 : 1,
                                            }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: item.dim ? 0.5 : 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.08 }}
                                        >
                                            <div style={{ fontSize: 20 }}>{item.emoji}</div>
                                            <div style={{
                                                width: 60,
                                                padding: '4px 8px',
                                                borderRadius: 4,
                                                background: item.color,
                                                color: '#fff',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}>
                                                {item.action}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: '#fff', fontSize: 13 }}>{item.desc}</div>
                                                {item.note && (
                                                    <div style={{ color: '#666', fontSize: 10, marginTop: 2 }}>{item.note}</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* 오른쪽: 베팅 있을 때 */}
                            <div>
                                <div style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: '#3498db',
                                    marginBottom: 12,
                                    textAlign: 'center',
                                    padding: '8px 0',
                                    background: 'rgba(52, 152, 219, 0.15)',
                                    borderRadius: 8,
                                }}>
                                    앞에 베팅이 있을 때
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {ACTIONS_WITH_BET.map((item, i) => (
                                        <motion.div
                                            key={item.action}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '10px 12px',
                                                borderRadius: 8,
                                                background: 'rgba(255,255,255,0.05)',
                                            }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + i * 0.08 }}
                                        >
                                            <div style={{ fontSize: 20 }}>{item.emoji}</div>
                                            <div style={{
                                                width: 60,
                                                padding: '4px 8px',
                                                borderRadius: 4,
                                                background: item.color,
                                                color: '#fff',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}>
                                                {item.action}
                                            </div>
                                            <div style={{ color: '#fff', fontSize: 13 }}>{item.desc}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 구분선 */}
                        <div style={{
                            height: 1,
                            background: 'rgba(255, 255, 255, 0.15)',
                            margin: '20px 0',
                        }} />

                        {/* 라운드 진행 조건 */}
                        <motion.div
                            style={{
                                background: 'rgba(241, 196, 15, 0.1)',
                                borderRadius: 8,
                                padding: 16,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#f1c40f',
                                marginBottom: 10,
                            }}>
                                🔄 다음 라운드로 넘어가는 조건
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                                color: '#ccc',
                                fontSize: 13,
                            }}>
                                <div>• 모든 플레이어가 <span style={{ color: '#e74c3c' }}>Fold</span> 또는 <span style={{ color: '#3498db' }}>Call</span> (금액 맞춤)</div>
                                <div>• 또는 <span style={{ color: '#f39c12' }}>All-in</span> (더 낼 칩이 없음)</div>
                            </div>
                        </motion.div>

                        {/* 팁 */}
                        <motion.div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                color: '#888',
                                fontSize: 12,
                                marginTop: 16,
                                justifyContent: 'center',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span>💡</span>
                            <span>한 라운드에 누군가 Raise하면, 다시 한 바퀴 돌아요!</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
