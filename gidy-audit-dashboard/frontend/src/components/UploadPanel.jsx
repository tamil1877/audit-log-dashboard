import { useState } from "react";
import { bulkUploadLogs } from "../api.js";

export default function UploadPanel({ onUploaded }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null); // null | "uploading" | "done" | "error"
  const [message, setMessage] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    try {
      const text = await file.text();
      const logs = JSON.parse(text);
      const result = await bulkUploadLogs(logs);
      setStatus("done");
      setMessage(result.message || `${result.count} logs uploaded`);
      onUploaded();
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Upload failed - check the file is valid JSON");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-1.5 text-sm font-medium bg-signal-accent text-white rounded-md hover:bg-signal-accentDark transition-colors shadow-sm"
      >
        + Upload logs
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-console-panel border border-console-border rounded-lg p-4 shadow-lg z-10">
          <p className="text-xs text-console-muted mb-2">
            Upload a JSON file (array of log records)
          </p>
          <input
            type="file"
            accept="application/json"
            onChange={handleFile}
            className="text-xs w-full file:mr-2 file:px-2 file:py-1 file:rounded-md file:border-0 file:bg-signal-accent/10 file:text-signal-accent file:text-xs file:font-medium"
          />
          {status === "uploading" && <p className="text-xs text-signal-amber mt-2">Uploading...</p>}
          {status === "done" && <p className="text-xs text-signal-green mt-2">{message}</p>}
          {status === "error" && <p className="text-xs text-signal-red mt-2">{message}</p>}
        </div>
      )}
    </div>
  );
}
