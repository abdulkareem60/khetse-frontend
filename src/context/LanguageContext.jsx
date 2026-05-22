/**
 * LanguageContext.jsx
 * Global language state — 'en' (English) or 'ur' (Urdu).
 * Persisted to localStorage so the choice survives page refresh.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('ks_lang') || 'en'
  );

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem('ks_lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ur' : 'en');
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isUrdu: lang === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook to consume language context anywhere in the tree. */
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}