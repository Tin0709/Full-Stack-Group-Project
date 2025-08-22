
import React, { useState } from "react";
export default function ConfirmButton({ onConfirm, children="Delete", className="btn btn-outline-danger btn-sm", question="Are you sure?" }){
  const [asking, setAsking] = useState(false);
  return (
    <span>
      {!asking ? (
        <button type="button" className={className} onClick={()=>setAsking(true)}>{children}</button>
      ) : (
        <span className="d-inline-flex gap-2 align-items-center">
          <span className="small">{question}</span>
          <button type="button" className="btn btn-danger btn-sm" onClick={()=>{ setAsking(false); onConfirm?.(); }}>Yes</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setAsking(false)}>No</button>
        </span>
      )}
    </span>
  );
}
