
import React, { useRef, useState } from "react";
export default function CSVImport({ onRows, header=true, sampleHeaders=["name","price","description","stock","category"] }){
  const fileRef = useRef();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  function parseCSV(text){
    const lines = text.split(/\r?\n/).filter(l=>l.trim().length);
    if(lines.length===0) return [];
    let headers; let startIdx = 0;
    if(header){ headers = splitCSVLine(lines[0]); startIdx = 1; } else { headers = sampleHeaders; }
    return lines.slice(startIdx).map(line=>{ const cols = splitCSVLine(line); const obj={}; headers.forEach((h,i)=> obj[h.trim()] = cols[i] ?? ""); return obj; });
  }
  function splitCSVLine(line){
    const res=[]; let cur=""; let inQ=false;
    for(let i=0;i<line.length;i++){ const ch=line[i];
      if(ch === '"'){ if(inQ && line[i+1]==='"'){ cur+='"'; i++; } else inQ=!inQ; }
      else if(ch === "," && !inQ){ res.push(cur); cur=""; }
      else { cur+=ch; }
    }
    res.push(cur); return res;
  }
  async function handleFile(ev){ setError(""); const f = ev.target.files?.[0]; if(!f) return; const text = await f.text(); try{ const parsed = parseCSV(text); setRows(parsed); onRows?.(parsed);} catch(e){ console.error(e); setError("Failed to parse CSV"); } }
  return (
    <div>
      <input type="file" accept=".csv,text/csv" ref={fileRef} className="form-control" onChange={handleFile} />
      {error && <div className="text-danger small mt-2">{error}</div>}
      {rows.length>0 && <div className="alert alert-success mt-2">Parsed <strong>{rows.length}</strong> rows.</div>}
      <div className="form-text">Expected headers: {sampleHeaders.join(", ")}</div>
    </div>
  );
}
