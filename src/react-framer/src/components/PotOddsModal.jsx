import { motion, AnimatePresence } from 'framer-motion';

/**
 * Pot Odds 교육 모달
 * 배당률 개념과 승률 비교를 통한 의사결정 설명
 */
export default function PotOddsModal({ show, data }) {
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
                            width: 520,
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
                            marginBottom: 16,
                            textAlign: 'center',
                        }}>
                            📐 {data.title}
                        </div>

                        {/* 공식 */}
                        <motion.div
                            style={{
                                background: 'rgba(155, 89, 182, 0.15)',
                                borderRadius: 8,
                                padding: '12px 16px',
                                marginBottom: 16,
                                textAlign: 'center',
                                border: '1px solid rgba(155, 89, 182, 0.3)',
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>공식</div>
                            <div style={{ fontSize: 15, color: '#fff', fontFamily: 'monospace' }}>
                                Pot Odds = <span style={{ color: '#e74c3c' }}>투자금</span> / (<span style={{ color: '#27ae60' }}>이득금</span> + <span style={{ color: '#e74c3c' }}>투자금</span>)
                            </div>
                        </motion.div>

                        {/* 극단 케이스 */}
                        <motion.div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: 8,
                                marginBottom: 16,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {data.extremeCases?.map((ec, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 8,
                                        padding: '10px 8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: ec.color || '#fff',
                                        marginBottom: 4,
                                    }}>
                                        {ec.potOdds}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>
                                        {ec.meaning}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#aaa' }}>
                                        {ec.decision}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* 핵심 규칙 */}
                        <motion.div
                            style={{
                                background: 'rgba(241, 196, 15, 0.1)',
                                borderRadius: 8,
                                padding: '10px 16px',
                                marginBottom: 16,
                                textAlign: 'center',
                                border: '1px solid rgba(241, 196, 15, 0.3)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span style={{ color: '#f1c40f', fontSize: 13 }}>
                                💡 내 승률 {'>'} Pot Odds → <span style={{ color: '#27ae60' }}>+EV (콜)</span>
                            </span>
                            <span style={{ margin: '0 12px', color: '#555' }}>|</span>
                            <span style={{ color: '#f1c40f', fontSize: 13 }}>
                                내 승률 {'<'} Pot Odds → <span style={{ color: '#e74c3c' }}>-EV (폴드)</span>
                            </span>
                        </motion.div>

                        {/* 실제 비교 테이블 */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 12,
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 70px 70px 60px',
                                gap: 8,
                                fontSize: 11,
                                color: '#666',
                                marginBottom: 8,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <span>상황</span>
                                <span style={{ textAlign: 'center' }}>Pot Odds</span>
                                <span style={{ textAlign: 'center' }}>승률</span>
                                <span style={{ textAlign: 'right' }}>판정</span>
                            </div>

                            {data.scenarios?.map((scenario, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 70px 70px 60px',
                                        gap: 8,
                                        fontSize: 13,
                                        padding: '8px 0',
                                        borderBottom: i < data.scenarios.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                >
                                    <span style={{ color: '#ccc' }}>{scenario.situation}</span>
                                    <span style={{ textAlign: 'center', color: '#9b59b6', fontWeight: 'bold' }}>
                                        {scenario.potOdds}%
                                    </span>
                                    <span style={{ textAlign: 'center', color: '#3498db' }}>
                                        {scenario.equity}%
                                    </span>
                                    <span style={{
                                        textAlign: 'right',
                                        color: scenario.verdict === '+EV' ? '#27ae60' : '#e74c3c',
                                        fontWeight: 'bold',
                                    }}>
                                        {scenario.verdict === '+EV' ? '✅ 콜' : '❌ 폴드'}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* 결론 */}
                        <motion.div
                            style={{
                                fontSize: 14,
                                color: '#fff',
                                textAlign: 'center',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            🎯 {data.conclusion}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
