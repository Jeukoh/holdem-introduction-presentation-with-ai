import { motion, AnimatePresence } from 'framer-motion';

/**
 * 결과 비교 모달
 * 두 가지 플레이 방식의 결과를 비교
 */
export default function ComparisonModal({ show, data }) {
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
                            width: 480,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(155, 89, 182, 0.3)',
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#9b59b6',
                            marginBottom: 24,
                            textAlign: 'center',
                        }}>
                            ⚖️ {data.title}
                        </div>

                        {/* 비교 카드들 */}
                        <div style={{
                            display: 'flex',
                            gap: 16,
                            marginBottom: 20,
                        }}>
                            {data.scenarios.map((scenario, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        padding: 16,
                                        borderRadius: 12,
                                        background: scenario.result.startsWith('-')
                                            ? 'rgba(231, 76, 60, 0.15)'
                                            : 'rgba(39, 174, 96, 0.15)',
                                        border: `2px solid ${scenario.result.startsWith('-') ? '#e74c3c' : '#27ae60'}`,
                                        textAlign: 'center',
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.15 }}
                                >
                                    {/* 시나리오 이름 */}
                                    <div style={{
                                        fontSize: 13,
                                        color: '#888',
                                        marginBottom: 8,
                                    }}>
                                        {scenario.name}
                                    </div>

                                    {/* 결과 */}
                                    <div style={{
                                        fontSize: 28,
                                        fontWeight: 'bold',
                                        color: scenario.result.startsWith('-') ? '#e74c3c' : '#27ae60',
                                        marginBottom: 8,
                                    }}>
                                        {scenario.result}
                                    </div>

                                    {/* 설명 */}
                                    <div style={{
                                        fontSize: 11,
                                        color: '#aaa',
                                    }}>
                                        {scenario.description}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* 차이 강조 */}
                        <motion.div
                            style={{
                                textAlign: 'center',
                                padding: '16px',
                                background: 'linear-gradient(135deg, rgba(241, 196, 15, 0.2), rgba(241, 196, 15, 0.05))',
                                borderRadius: 8,
                                border: '1px solid rgba(241, 196, 15, 0.3)',
                            }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>
                                결정 하나의 차이
                            </div>
                            <div style={{
                                fontSize: 32,
                                fontWeight: 'bold',
                                color: '#f1c40f',
                            }}>
                                {data.difference}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
