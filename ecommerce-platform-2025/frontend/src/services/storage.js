
const KEY_PREFIX = "vendor:";
export function load(key, fallback) { try { const raw = localStorage.getItem(KEY_PREFIX + key); if (!raw) return fallback; return JSON.parse(raw);} catch(e){ console.error(e); return fallback;}}
export function save(key, data) { try { localStorage.setItem(KEY_PREFIX + key, JSON.stringify(data)); } catch(e){ console.error(e);}}
export function uid(prefix = "id") { const rnd = Math.random().toString(36).slice(2,10); const ts = Date.now().toString(36); return `${prefix}_${ts}_${rnd}`; }
