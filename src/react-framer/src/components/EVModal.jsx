import { motion, AnimatePresence } from 'framer-motion';

/**
 * EV(기대값) 계산 모달
 * 베팅 결정의 수학적 근거를 보여줌
 */
export default function EVModal({ show, data }) {
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
                            width: 450,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(52, 152, 219, 0.3)',
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#3498db',
                            marginBottom: 8,
                            textAlign: 'center',
                        }}>
                            🧮 {data.title}
                        </div>

                        {/* 상황 정보 */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 20,
                            marginBottom: 20,
                            fontSize: 13,
                            color: '#888',
                        }}>
                            <span>팟: <span style={{ color: '#f1c40f' }}>{data.potSize}BB</span></span>
                            <span>베팅: <span style={{ color: '#e74c3c' }}>{data.betSize}BB</span></span>
                        </div>

                        {/* 시나리오 테이블 */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 16,
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 60px 80px',
                                gap: 8,
                                fontSize: 12,
                                color: '#666',
                                marginBottom: 8,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <span>결과</span>
                                <span style={{ textAlign: 'center' }}>확률</span>
                                <span style={{ textAlign: 'right' }}>수익</span>
                            </div>

                            {data.scenarios.map((scenario, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 60px 80px',
                                        gap: 8,
                                        fontSize: 13,
                                        padding: '6px 0',
                                    }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <span style={{ color: '#ccc' }}>{scenario.outcome}</span>
                                    <span style={{ textAlign: 'center', color: '#888' }}>
                                        {scenario.probability}%
                                    </span>
                                    <span style={{
                                        textAlign: 'right',
                                        color: scenario.result.startsWith('+') ? '#27ae60' : '#e74c3c',
                                        fontWeight: 'bold',
                                    }}>
                                        {scenario.result}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* EV 결과 */}
                        <motion.div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 12,
                                padding: '16px',
                                background: data.ev.startsWith('+')
                                    ? 'rgba(39, 174, 96, 0.2)'
                                    : 'rgba(231, 76, 60, 0.2)',
                                borderRadius: 8,
                                border: `1px solid ${data.ev.startsWith('+') ? '#27ae60' : '#e74c3c'}`,
                            }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span style={{ color: '#fff', fontSize: 14 }}>기대값 (EV):</span>
                            <span style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: data.ev.startsWith('+') ? '#27ae60' : '#e74c3c',
                            }}>
                                {data.ev}
                            </span>
                        </motion.div>

                        {/* 결론 */}
                        <motion.div
                            style={{
                                marginTop: 16,
                                fontSize: 14,
                                color: '#fff',
                                textAlign: 'center',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            ✅ {data.conclusion}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
