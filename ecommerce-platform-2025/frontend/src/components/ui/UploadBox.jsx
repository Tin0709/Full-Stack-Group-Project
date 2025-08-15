import React from "react";

export default function UploadBox({
  label = "Profile Picture",
  file,
  onFile,
  required = true,
  errorMsg = "Please choose an image file.",
}) {
  const ok = !required || !!file;
  return (
    <div className="mb-2">
      <label className="form-label fw-medium d-block">{label}</label>
      <div className="upload-box border border-2 border-dashed rounded-3 p-4 text-center">
        <p className="fw-bold mb-1">{label}</p>
        <p className="text-muted small mb-3">Upload a profile picture</p>
        <label className="btn btn-outline-dark">
          Upload
          <input
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <p className="small mt-2 mb-0 text-truncate">
            Selected: <span className="fw-medium">{file.name}</span>
          </p>
        )}
      </div>
      {!ok && <div className="form-text text-danger mt-2">{errorMsg}</div>}
    </div>
  );
}
