// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin Nguyen (S3988418)
// File: UploadBox.jsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./uploadBox.css";

export default function UploadBox({
  // Existing prop names used in your pages:
  file, // File | null
  onFile, // (File|null) => void

  // Also support value/onChange for future use:
  value,
  onChange,

  // Nice-to-have customizations:
  label = "Profile Picture",
  helperText = "Upload a profile picture",
  name = "profilePicture",
  accept = "image/*",
  maxSizeMB = 5,
}) {
  // Normalize to a single controlled interface internally
  const controlledFile = value !== undefined ? value : file;
  const emit = useCallback(
    (f) => {
      if (onChange) onChange(f || null);
      if (onFile) onFile(f || null);
    },
    [onChange, onFile]
  );

  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState(controlledFile || null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Keep internal state in sync with controlled value
  useEffect(() => {
    if (value !== undefined) setSelected(value || null);
    else if (file !== undefined) setSelected(file || null);
  }, [value, file]);

  // Build/Revoke preview URL
  useEffect(() => {
    if (!selected) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selected]);

  const clear = useCallback(() => {
    setSelected(null);
    setError("");
    emit(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [emit]);

  const validateAndSet = useCallback(
    (f) => {
      if (!f) return;
      if (
        (accept?.includes("image") || accept?.startsWith("image/")) &&
        !f.type.startsWith("image/")
      ) {
        setError("Please choose an image file.");
        return;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File is too large. Max ${maxSizeMB}MB.`);
        return;
      }
      setError("");
      setSelected(f);
      emit(f);
    },
    [accept, maxSizeMB, emit]
  );

  const onInputChange = (e) => validateAndSet(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0];
    validateAndSet(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const openPicker = () => inputRef.current?.click();
  const onKeyActivate = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>

      <div
        className={`upload-box border rounded-3 p-4 text-center position-relative ${
          isDragging ? "dragging" : ""
        } ${preview ? "has-preview" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Upload image. Drag & drop or press Enter to browse."
        onKeyDown={onKeyActivate}
        onClick={openPicker}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="d-none"
          onChange={onInputChange}
        />

        {!preview && (
          <>
            <div className="fs-4 fw-bold mb-2">Profile Picture</div>
            <p className="text-muted mb-3">{helperText}</p>
            <button
              type="button"
              className="btn btn-outline-dark px-4"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
            >
              Upload
            </button>
            <div className="mt-3 small text-secondary">
              or drag & drop an image here (max {maxSizeMB}MB)
            </div>
            {isDragging && <div className="drop-overlay" />}
          </>
        )}

        {preview && (
          <div className="preview-wrap">
            <img src={preview} alt="Selected" className="preview-img" />
            <div className="d-flex gap-2 justify-content-center mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="form-text text-danger mt-2">{error}</div>}
    </div>
  );
}
