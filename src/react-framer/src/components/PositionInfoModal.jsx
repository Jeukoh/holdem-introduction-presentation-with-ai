import { motion, AnimatePresence } from 'framer-motion';

// ===========================================
// POSITION INFO MODAL - 포지션 용어 설명
// 액션 순서대로 정렬 (먼저 행동 → 나중에 행동 = 유리)
// ===========================================

// SVG 에셋 색상과 일치시킴 (assets/positions/*.svg)
const POSITIONS = [
    { abbr: 'SB', full: 'Small Blind', desc: '0.5 BB 강제 베팅', note: '플랍 이후 첫 액션', color: '#3498db' },
    { abbr: 'BB', full: 'Big Blind', desc: '1 BB 강제 베팅', note: '최소 베팅/레이즈 단위', color: '#2ecc71' },
    { abbr: 'UTG', full: 'Under The Gun', desc: '프리플랍 첫 액션', note: '가장 불리', color: '#e74c3c' },
    { abbr: 'HJ', full: 'Hijack', desc: '중간 포지션', note: '', color: '#9b59b6' },
    { abbr: 'CO', full: 'Cutoff', desc: 'BTN 직전', note: '두 번째로 유리', color: '#f39c12' },
    { abbr: 'BTN', full: 'Button', desc: '딜러 버튼', note: '가장 유리!', color: '#d4a574', highlight: true },
];

export default function PositionInfoModal({ show }) {
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
                            width: 480,
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
                            🎯 포지션 = 액션 순서
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: '#888',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                            늦게 행동할수록 유리! (상대 정보를 더 많이 볼 수 있음)
                        </div>

                        {/* 테이블 헤더 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 130px 1fr 100px',
                            gap: 8,
                            marginBottom: 8,
                            padding: '0 4px',
                        }}>
                            <div style={{ color: '#666', fontSize: 11, fontWeight: 'bold' }}>순서</div>
                            <div style={{ color: '#666', fontSize: 11, fontWeight: 'bold' }}>포지션</div>
                            <div style={{ color: '#666', fontSize: 11, fontWeight: 'bold' }}>설명</div>
                            <div style={{ color: '#666', fontSize: 11, fontWeight: 'bold', textAlign: 'right' }}>특징</div>
                        </div>

                        {/* 구분선 */}
                        <div style={{
                            height: 1,
                            background: 'rgba(255, 255, 255, 0.15)',
                            marginBottom: 12,
                        }} />

                        {/* 포지션 목록 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {POSITIONS.map((pos, i) => (
                                <motion.div
                                    key={pos.abbr}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '60px 130px 1fr 100px',
                                        gap: 8,
                                        alignItems: 'center',
                                        padding: '8px 4px',
                                        borderRadius: 8,
                                        background: pos.highlight ? 'rgba(241, 196, 15, 0.15)' : 'transparent',
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                >
                                    {/* 순서 번호 */}
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 13,
                                        fontWeight: 'bold',
                                        color: '#888',
                                    }}>
                                        {i + 1}
                                    </div>

                                    {/* 포지션 뱃지 + 이름 */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 40,
                                            height: 22,
                                            borderRadius: 11,
                                            background: pos.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            color: pos.highlight ? '#000' : '#fff',
                                            flexShrink: 0,
                                        }}>
                                            {pos.abbr}
                                        </div>
                                        <span style={{
                                            color: '#aaa',
                                            fontSize: 11,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {pos.full}
                                        </span>
                                    </div>

                                    {/* 설명 */}
                                    <div style={{
                                        color: '#fff',
                                        fontSize: 13,
                                    }}>
                                        {pos.desc}
                                    </div>

                                    {/* 특징 */}
                                    <div style={{
                                        color: pos.highlight ? '#f1c40f' : '#666',
                                        fontSize: 12,
                                        textAlign: 'right',
                                        fontWeight: pos.highlight ? 'bold' : 'normal',
                                    }}>
                                        {pos.note}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* 구분선 */}
                        <div style={{
                            height: 1,
                            background: 'rgba(255, 255, 255, 0.15)',
                            margin: '16px 0',
                        }} />

                        {/* 팁들 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    color: '#ffd700',
                                    fontSize: 13,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span>💡</span>
                                <span>BTN이 마지막에 액션 → 정보 우위 → 가장 유리!</span>
                            </motion.div>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    color: '#aaa',
                                    fontSize: 12,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span>🔄</span>
                                <span>매 판마다 버튼이 시계방향으로 이동 (공평!)</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
