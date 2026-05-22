/**
 * src/context/LanguageContext.jsx
 *
 * Global language state: 'en' (English) or 'ur' (Urdu).
 * Persisted to localStorage so the choice survives page refresh.
 *
 * Usage:
 *   const { lang, isUrdu, toggleLang } = useLang();
 */

import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('ks_lang') || 'en'
  );

  const setLang = useCallback((code) => {
    setLangState(code);
    localStorage.setItem('ks_lang', code);
    // Apply RTL direction to the document for Urdu
    document.documentElement.setAttribute(
      'dir', code === 'ur' ? 'rtl' : 'ltr'
    );
    document.documentElement.setAttribute('lang', code);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ur' : 'en');
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isUrdu: lang === 'ur',
        isEnglish: lang === 'en',
        setLang,
        toggleLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}