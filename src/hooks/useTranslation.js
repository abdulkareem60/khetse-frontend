/**
 * src/hooks/useTranslation.js
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';
import {
  translateDict,
  translateProducts,
  translateText,
} from '../services/translationService';

// ── Hook 1: UI string dictionary ─────────────────────────────────────────────
export function useT(englishDict = {}) {
  const { lang } = useLang();
  const safe = englishDict || {};
  const [t,           setT]           = useState(safe);
  const [translating, setTranslating] = useState(false);
  const dictRef = useRef(safe);
  dictRef.current = safe;

  useEffect(() => {
    const current = dictRef.current || {};
    setT(current);
    if (lang === 'en' || Object.keys(current).length === 0) return;

    let cancelled = false;
    setTranslating(true);

    translateDict(current, 'en', 'ur')
      .then((translated) => { if (!cancelled) setT(translated); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTranslating(false); });

    return () => { cancelled = true; };
  }, [lang]);

  return { t, translating };
}

// ── Hook 2: product array ─────────────────────────────────────────────────────
export function useTranslatedProducts(rawProducts) {
  const { lang } = useLang();
  const [items,       setItems]       = useState(rawProducts || []);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const source = rawProducts || [];
    setItems(source);
    if (lang === 'en' || !source.length) return;

    let cancelled = false;
    setTranslating(true);

    translateProducts(source, 'en', 'ur')
      .then((translated) => { if (!cancelled) setItems(translated); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTranslating(false); });

    return () => { cancelled = true; };
  }, [rawProducts, lang]);

  return { items, translating };
}

// ── Hook 3: single string ─────────────────────────────────────────────────────
export function useTranslatedText(text) {
  const { lang } = useLang();
  const [translated,  setTranslated]  = useState(text || '');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    setTranslated(text || '');
    if (lang === 'en' || !text) return;

    let cancelled = false;
    setTranslating(true);

    translateText(text, 'en', 'ur')
      .then((r) => { if (!cancelled) setTranslated(r); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTranslating(false); });

    return () => { cancelled = true; };
  }, [text, lang]);

  return { translated, translating };
}

// ── Utility: one-shot imperative translation ──────────────────────────────────
export function useTranslateFn() {
  const { lang } = useLang();
  return useCallback(
    (text) => translateText(text, 'en', lang),
    [lang]
  );
}