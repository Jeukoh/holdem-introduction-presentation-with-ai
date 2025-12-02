import { motion, AnimatePresence } from 'framer-motion';

/**
 * 승률(Equity) 설명 모달
 * AA가 상대 수에 따라 어떻게 변하는지 시각화
 */
export default function EquityModal({ show, data }) {
    if (!data) return null;

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
                >
                    <motion.div
                        style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            borderRadius: 16,
                            padding: '24px 32px',
                            width: 420,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(241, 196, 15, 0.3)',
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#f1c40f',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                            📊 {data.title}
                        </div>

                        {/* 승률 바 차트 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {data.scenarios.map((scenario, i) => (
                                <motion.div
                                    key={i}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        color: '#ccc',
                                    }}>
                                        <span>{scenario.situation}</span>
                                        <span style={{
                                            color: scenario.equity >= 70 ? '#27ae60' :
                                                   scenario.equity >= 50 ? '#f1c40f' : '#e74c3c',
                                            fontWeight: 'bold',
                                        }}>
                                            {scenario.equity}%
                                        </span>
                                    </div>
                                    <div style={{
                                        height: 20,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                    }}>
                                        <motion.div
                                            style={{
                                                height: '100%',
                                                background: scenario.equity >= 70
                                                    ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                                                    : scenario.equity >= 50
                                                    ? 'linear-gradient(90deg, #f39c12, #f1c40f)'
                                                    : 'linear-gradient(90deg, #c0392b, #e74c3c)',
                                                borderRadius: 10,
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${scenario.equity}%` }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* 구분선 */}
                        <div style={{
                            height: 1,
                            background: 'rgba(255,255,255,0.15)',
                            margin: '20px 0',
                        }} />

                        {/* 결론 */}
                        <motion.div
                            style={{
                                fontSize: 15,
                                color: '#fff',
                                textAlign: 'center',
                                padding: '12px 16px',
                                background: 'rgba(241, 196, 15, 0.15)',
                                borderRadius: 8,
                                border: '1px solid rgba(241, 196, 15, 0.3)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            💡 {data.conclusion}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
