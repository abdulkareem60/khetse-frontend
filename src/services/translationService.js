/**
 * translationService.js
 * Central service for LibreTranslate API calls.
 * Endpoint: http://127.0.0.1:7860/translate
 */

const LIBRE_URL = 'http://127.0.0.1:7860/translate';

// Simple in-memory cache: "text|source|target" -> translated string
const cache = new Map();

/**
 * Translate a single string.
 * @param {string} text     - Text to translate
 * @param {string} source   - Source language code ('en' | 'ur')
 * @param {string} target   - Target language code ('en' | 'ur')
 * @returns {Promise<string>} Translated text, or original on failure
 */
export async function translateText(text, source = 'en', target = 'ur') {
  if (!text || source === target) return text;

  const key = `${text}|${source}|${target}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const res = await fetch(LIBRE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' }),
    });

    if (!res.ok) throw new Error(`LibreTranslate HTTP ${res.status}`);

    const data = await res.json();
    const translated = data.translatedText || text;
    cache.set(key, translated);
    return translated;
  } catch (err) {
    console.warn('[LibreTranslate] Translation failed, using original:', err.message);
    return text; // Graceful fallback — show original text
  }
}

/**
 * Translate multiple strings in one batch.
 * Fires parallel requests and respects the cache.
 * @param {string[]} texts
 * @param {string}   source
 * @param {string}   target
 * @returns {Promise<string[]>}
 */
export async function translateBatch(texts, source = 'en', target = 'ur') {
  if (source === target) return texts;
  return Promise.all(texts.map(t => translateText(t, source, target)));
}

/**
 * Translate all translatable fields of a product object.
 * Returns a new object with translated name and description,
 * leaving every other field unchanged.
 * @param {Object} product
 * @param {string} source
 * @param {string} target
 * @returns {Promise<Object>}
 */
export async function translateProduct(product, source = 'en', target = 'ur') {
  if (source === target) return product;

  const fields = [product.name || '', product.description || ''];
  const [name, description] = await translateBatch(fields, source, target);

  return { ...product, name, description };
}

/**
 * Translate an array of products in parallel.
 */
export async function translateProducts(products, source = 'en', target = 'ur') {
  if (source === target) return products;
  return Promise.all(products.map(p => translateProduct(p, source, target)));
}

/** Clear the translation cache (useful for testing). */
export function clearCache() { cache.clear(); }