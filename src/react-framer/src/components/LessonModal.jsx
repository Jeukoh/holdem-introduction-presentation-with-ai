import { motion, AnimatePresence } from 'framer-motion';

/**
 * 교훈/레슨 모달
 * 핵심 포인트를 강조
 */
export default function LessonModal({ show, data }) {
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
                            padding: '28px 36px',
                            width: 420,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '2px solid rgba(241, 196, 15, 0.5)',
                        }}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#f1c40f',
                            marginBottom: 24,
                            textAlign: 'center',
                        }}>
                            📝 {data.title}
                        </div>

                        {/* 포인트들 */}
                        {data.points && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}>
                                {data.points.map((point, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '12px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 8,
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                    >
                                        <div style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: '#f1c40f',
                                            color: '#000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                            flexShrink: 0,
                                        }}>
                                            {i + 1}
                                        </div>
                                        <span style={{
                                            color: '#fff',
                                            fontSize: 14,
                                            lineHeight: 1.4,
                                        }}>
                                            {point}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* 단순 메시지 (points 없을 때) */}
                        {!data.points && data.description && (
                            <motion.div
                                style={{
                                    fontSize: 16,
                                    color: '#fff',
                                    textAlign: 'center',
                                    lineHeight: 1.6,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {data.description}
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
