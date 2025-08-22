
import { load, save } from "./storage";
const KEY = "settings";
const defaults = { storeName:"My Store", email:"store@example.com", phone:"", address:"", logo:"" };
export function getSettings(){ return { ...defaults, ...load(KEY, {}) }; }
export function updateSettings(patch){ const next = { ...getSettings(), ...patch }; save(KEY, next); return next; }
