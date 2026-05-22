/**
 * useTranslation.js
 * Custom hook — translates a list of product objects whenever
 * the language or the source data changes.
 *
 * Usage:
 *   const { items, translating } = useTranslatedProducts(rawProducts);
 */

import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import { translateProducts } from '../services/translationService';

/**
 * Translates an array of products reactively.
 * @param {Object[]} products  Raw English products from the API
 * @returns {{ items: Object[], translating: boolean }}
 */
export function useTranslatedProducts(products) {
  const { lang } = useLang();
  const [items,       setItems]       = useState(products);
  const [translating, setTranslating] = useState(false);
  const abortRef = useRef(false);   // Prevents stale async updates

  useEffect(() => {
    // Always reset to original first so UI isn't stale
    setItems(products);

    if (lang === 'en' || !products?.length) return;

    let cancelled = false;
    abortRef.current = false;
    setTranslating(true);

    translateProducts(products, 'en', 'ur')
      .then(translated => {
        if (!cancelled) setItems(translated);
      })
      .catch(() => { /* silent fallback — original already set */ })
      .finally(() => { if (!cancelled) setTranslating(false); });

    return () => { cancelled = true; };
  }, [products, lang]);

  return { items, translating };
}

/**
 * Translates a single string reactively.
 * @param {string} text
 * @returns {{ translated: string, translating: boolean }}
 */
export function useTranslatedText(text) {
  const { lang } = useLang();
  const [translated,  setTranslated]  = useState(text);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    setTranslated(text);
    if (lang === 'en' || !text) return;

    let cancelled = false;
    setTranslating(true);

    import('../services/translationService').then(({ translateText }) =>
      translateText(text, 'en', 'ur')
    ).then(result => {
      if (!cancelled) setTranslated(result);
    }).finally(() => { if (!cancelled) setTranslating(false); });

    return () => { cancelled = true; };
  }, [text, lang]);

  return { translated, translating };
}