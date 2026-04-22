import { CheckCircle2, ImageIcon, UploadIcon, AlertCircle, FileWarningIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  REDIRECT_DELAY_MS,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  CAD_EXTENSIONS,
  CAD_EXPORT_GUIDE,
} from "../lib/constants";

type ValidationResult =
  | { ok: true }
  | { ok: false; message: string; isCad?: boolean; cadHint?: string };

interface UploadProps {
  onComplete: (base64: string) => void;
}

const validateFile = (f: File): ValidationResult => {
  const ext = ("." + f.name.split(".").pop()?.toLowerCase()) as string;

  if ((CAD_EXTENSIONS as readonly string[]).includes(ext)) {
    return {
      ok: false,
      isCad: true,
      message: `CAD file detected (${ext})`,
      cadHint: CAD_EXPORT_GUIDE[ext] ?? "Please export as PNG or TIFF from your CAD tool first.",
    };
  }

  const mimeOk = (ALLOWED_MIME_TYPES as readonly string[]).includes(f.type);
  const extOk = (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
  if (!mimeOk && !extOk) return { ok: false, message: `Unsupported file type (${ext || f.type}).` };
  if (f.size > MAX_FILE_SIZE)
    return { ok: false, message: `File exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` };

  return { ok: true };
};

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cadHint, setCadHint] = useState<string | null>(null);
  const base64Ref = useRef<string | null>(null);
  const { isSignedIn } = useOutletContext<AuthContext>();

  useEffect(() => {
    if (progress !== 100 || !base64Ref.current) return;
    const timer = setTimeout(() => {
      onComplete(base64Ref.current!);
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const processFile = (selectedFile: File) => {
    const result = validateFile(selectedFile);
    if (!result.ok) {
      setError(result.message);
      setCadHint(result.cadHint ?? null);
      return;
    }

    setError(null);
    setCadHint(null);
    setFile(selectedFile);
    setProgress(0);
    base64Ref.current = null;

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    reader.onload = () => {
      base64Ref.current = reader.result as string;
      setProgress(100);
    };

    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setFile(null);
      setProgress(0);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSignedIn) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSignedIn) return;
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  return (
    <div className="upload">
      {error && (
        <div className={`upload-error ${cadHint ? "is-cad-error" : ""}`}>
          {cadHint ? <FileWarningIcon size={16} /> : <AlertCircle size={16} />}
          <div>
            <span>{error}</span>
            {cadHint && <p className="cad-hint">{cadHint}</p>}
          </div>
        </div>
      )}

      {!file ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""} ${!isSignedIn ? "is-disabled" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept={ALLOWED_EXTENSIONS.join(",")}
            disabled={isSignedIn !== true}
            onChange={handleChange}
          />
          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? "Click to upload or drag and drop"
                : "Sign in or sign up with Puter to upload"}
            </p>
            <p className="help">JPG, PNG, TIFF, BMP, WebP — Max 25MB</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>
            <h3>{file.name}</h3>
            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />
              <p className="status-text">
                {progress < 100 ? `Analyzing Floor Plan... ${progress}%` : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
