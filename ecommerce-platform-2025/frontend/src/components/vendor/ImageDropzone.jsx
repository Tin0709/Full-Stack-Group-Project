
import React, { useCallback, useState } from "react";
export default function ImageDropzone({ value, onChange }){
  const [isOver, setIsOver] = useState(false);
  const onDrop = useCallback(async (ev)=>{ ev.preventDefault(); setIsOver(false); const f = ev.dataTransfer.files?.[0]; if(!f) return; const b64 = await fileToBase64(f); onChange?.(b64); }, [onChange]);
  function onPick(ev){ const f = ev.target.files?.[0]; if(!f) return; fileToBase64(f).then(onChange); }
  return (
    <div>
      <div onDragOver={(e)=>{ e.preventDefault(); setIsOver(true);}}
           onDragLeave={()=>setIsOver(false)}
           onDrop={onDrop}
           className={"border rounded p-3 text-center " + (isOver ? "bg-light" : "")}
           style={{ cursor: "pointer" }}
           onClick={()=>document.getElementById("img-input").click()}>
        {value ? (<img src={value} alt="Preview" style={{ maxHeight: 160 }} className="rounded" />) : (<div className="text-muted">Drag & drop image here, or click to select</div>)}
      </div>
      <input id="img-input" type="file" accept="image/*" hidden onChange={onPick} />
    </div>
  );
}
function fileToBase64(file){ return new Promise((resolve, reject)=>{ const reader = new FileReader(); reader.onerror = reject; reader.onload = ()=>resolve(reader.result); reader.readAsDataURL(file); }); }
