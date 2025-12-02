import { useState, useEffect } from 'react';

// 전역 캐시 - 한 번 로드되면 메모리에 유지
let cachedCards = null;
let loadPromise = null;

/**
 * 카드 번들을 로드하고 캐시하는 훅
 * window.CARDS_BUNDLE이 있으면 즉시 사용 (프리로드 지원)
 * @returns {Object|null} 카드 SVG 콘텐츠 맵 (예: { AS: '<svg>...</svg>', KH: '...' })
 */
export function useCardBundle() {
    // window.CARDS_BUNDLE 프리로드 체크
    if (!cachedCards && typeof window !== 'undefined' && window.CARDS_BUNDLE) {
        cachedCards = window.CARDS_BUNDLE;
    }

    const [cards, setCards] = useState(cachedCards);

    useEffect(() => {
        // 이미 캐시되어 있으면 즉시 반환
        if (cachedCards) {
            setCards(cachedCards);
            return;
        }

        // 이미 로딩 중이면 그 프로미스 재사용
        if (!loadPromise) {
            loadPromise = fetch('/assets/cards-bundle.json')
                .then(r => r.json())
                .then(data => {
                    cachedCards = data;
                    return data;
                })
                .catch(err => {
                    console.error('Failed to load cards bundle:', err);
                    loadPromise = null;
                    return null;
                });
        }

        loadPromise.then(data => {
            if (data) setCards(data);
        });
    }, []);

    return cards;
}

/**
 * 전역 번들 초기화 (index.html에서 미리 로드할 때 사용)
 */
export function initCardBundle(data) {
    cachedCards = data;
}

/**
 * 캐시 클리어 (디버깅용)
 */
export function clearCardBundleCache() {
    cachedCards = null;
    loadPromise = null;
}

export default useCardBundle;
