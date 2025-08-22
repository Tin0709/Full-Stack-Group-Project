
import { load, save, uid } from "./storage";
const KEY = "categories";
function seed(){ const cur = load(KEY, null); if(!cur){ save(KEY, [ {id:uid("cat"), name:"Beverage", description:"Drinks and beverages"}, {id:uid("cat"), name:"Food", description:"Food items"} ]); } } seed();
export function listCategories(){ return load(KEY, []); }
export function getCategory(id){ return listCategories().find(c=>c.id===id) || null; }
export function createCategory({name, description=""}){ const arr = listCategories(); const cat = { id: uid("cat"), name, description }; arr.push(cat); save(KEY, arr); return cat; }
export function updateCategory(id, patch){ const arr = listCategories(); const idx = arr.findIndex(c=>c.id===id); if(idx===-1) return null; arr[idx] = { ...arr[idx], ...patch }; save(KEY, arr); return arr[idx]; }
export function deleteCategory(id){ const arr = listCategories().filter(c=>c.id!==id); save(KEY, arr); }
