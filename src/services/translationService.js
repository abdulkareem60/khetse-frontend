/**
 * src/services/translationService.js
 *
 * Central LibreTranslate client.
 *
 * API URL is read from the environment variable:
 *   REACT_APP_LIBRE_TRANSLATE_URL=http://127.0.0.1:7860
 *
 * To switch to production, simply change that variable — no code edits needed.
 */

const BASE_URL =
  process.env.REACT_APP_LIBRE_TRANSLATE_URL || 'http://127.0.0.1:7860';

// ─── In-memory LRU-style cache ────────────────────────────────────────────────
// Key: "source|target|text" → translated string
const CACHE = new Map();
const CACHE_MAX = 2000;

function cacheKey(text, source, target) {
  return `${source}|${target}|${text}`;
}

function cacheSet(key, value) {
  if (CACHE.size >= CACHE_MAX) {
    // Evict oldest entry
    CACHE.delete(CACHE.keys().next().value);
  }
  CACHE.set(key, value);
}

// ─── Core translate function ──────────────────────────────────────────────────

/**
 * Translate a single string via LibreTranslate.
 *
 * @param {string} text    - Text to translate
 * @param {string} source  - Source language code: 'en' | 'ur'
 * @param {string} target  - Target language code: 'en' | 'ur'
 * @returns {Promise<string>} Translated string, or original on error
 */
export async function translateText(text, source = 'en', target = 'ur') {
  if (!text || !text.trim() || source === target) return text;

  const key = cacheKey(text, source, target);
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' }),
    });

    if (!res.ok) {
      throw new Error(`LibreTranslate returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const translated = data.translatedText ?? text;
    cacheSet(key, translated);
    return translated;
  } catch (err) {
    console.warn('[LibreTranslate] Failed:', err.message, '— using original text');
    return text; // Graceful degradation: show English if API is unreachable
  }
}

/**
 * Translate multiple strings in parallel.
 *
 * @param {string[]} texts
 * @param {string}   source
 * @param {string}   target
 * @returns {Promise<string[]>}
 */
export async function translateBatch(texts, source = 'en', target = 'ur') {
  if (source === target) return texts;
  return Promise.all(
    texts.map((t) => (t ? translateText(t, source, target) : Promise.resolve(t)))
  );
}

/**
 * Translate the name and description fields of a product object.
 * All other fields are left untouched.
 *
 * @param {Object} product
 * @param {string} source
 * @param {string} target
 * @returns {Promise<Object>}
 */
export async function translateProduct(product, source = 'en', target = 'ur') {
  if (source === target) return product;
  const [name, description] = await translateBatch(
    [product.name || '', product.description || ''],
    source,
    target
  );
  return { ...product, name, description };
}

/**
 * Translate an array of products in parallel.
 *
 * @param {Object[]} products
 * @param {string}   source
 * @param {string}   target
 * @returns {Promise<Object[]>}
 */
export async function translateProducts(products, source = 'en', target = 'ur') {
  if (source === target) return products;
  return Promise.all(products.map((p) => translateProduct(p, source, target)));
}

/**
 * Translate a flat key→string dictionary object (used for UI strings).
 *
 * @param {Object.<string,string>} dict
 * @param {string} source
 * @param {string} target
 * @returns {Promise<Object.<string,string>>}
 */
export async function translateDict(dict, source = 'en', target = 'ur') {
  if (source === target) return dict;
  const entries = Object.entries(dict);
  const values  = entries.map(([, v]) => v);
  const translated = await translateBatch(values, source, target);
  return Object.fromEntries(entries.map(([k], i) => [k, translated[i]]));
}

/** Expose the current cache size for debugging. */
export function getCacheSize() { return CACHE.size; }

/** Clear the cache (useful in tests). */
export function clearCache() { CACHE.clear(); }