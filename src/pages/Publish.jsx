import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, HardDrive, CheckCircle2, AlertTriangle, FileArchive, ArrowRight, Box } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";

export default function Publish() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [license, setLicense] = useState("MIT");
  const [repository, setRepository] = useState("");
  const [readme, setReadme] = useState("");
  const [dependencies, setDependencies] = useState("{}");
  
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Auto fill name if empty
      if (!name) {
        const cleanName = selectedFile.name.replace(/\.tgz$|\.tar\.gz$/, "").replace(/-\d+\.\d+\.\d+$/, "");
        setName(cleanName);
      }
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!name || !version) {
        throw new Error("Package name and version are required.");
      }

      // Convert file to Base64 if file uploaded
      let fileBase64 = "";
      if (file) {
        fileBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
        });
      }

      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        name,
        version,
        description,
        keywords,
        license,
        repository,
        readme: readme || `# ${name}\n\n${description}`,
        dependencies,
        fileBase64
      };

      const res = await fetch("/api/registry/publish", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish package.");
      }

      setSuccess(`Package ${name}@${version} published and stored in Google Drive!`);
      
      // Trigger celebrate confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate(`/package/${name}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={styles.badgeDrive}>
            <HardDrive size={16} color="var(--accent-cyan)" />
            <span>Google Drive Package Pipeline</span>
          </div>
          <h1 style={{ fontSize: "2.4rem", marginTop: "12px" }}>Publish a Quantum Package</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Upload package archive (.tgz) to store on Google Drive & serve to QPM CLI
          </p>
        </div>

        {!user && (
          <div style={styles.warningBox}>
            <AlertTriangle size={20} color="var(--accent-amber)" />
            <div>
              <strong>Note: You are currently not logged in.</strong>
              <p style={{ fontSize: "0.85rem", marginTop: "2px" }}>
                Publishing as guest will assign package ownership to community. Log in to claim author rights.
              </p>
            </div>
          </div>
        )}

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handlePublish} className="glass-card" style={styles.formCard}>
          {/* File Upload Zone */}
          <div>
            <label style={styles.label}>Package Tarball File (.tgz)</label>
            <div style={styles.dropZone}>
              <input
                type="file"
                accept=".tgz,.gz,.tar.gz"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              <FileArchive size={36} color="var(--accent-cyan)" style={{ marginBottom: "8px" }} />
              {fileName ? (
                <div>
                  <span style={{ fontWeight: "700", color: "#fff" }}>{fileName}</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--accent-emerald)" }}>File ready for Google Drive upload</p>
                </div>
              ) : (
                <div>
                  <span style={{ fontWeight: "600" }}>Click to select `.tgz` archive or drag file here</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "4px" }}>
                    Optional: If omitted, an empty package container will be generated.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
            <div>
              <label style={styles.label}>Package Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. quantum-utils"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={styles.label}>Version *</label>
              <input
                type="text"
                required
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Description</label>
            <input
              type="text"
              placeholder="High performance utility functions for Quantum Language"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={styles.label}>Keywords (comma separated)</label>
              <input
                type="text"
                placeholder="quantum, math, matrix"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={styles.label}>License</label>
              <input
                type="text"
                placeholder="MIT"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>GitHub Repository URL (Optional)</label>
            <input
              type="url"
              placeholder="https://github.com/username/repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={styles.label}>Dependencies JSON (Optional)</label>
            <textarea
              rows={3}
              placeholder='{ "quantum-core": "^1.0.0" }'
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              className="input-field"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
            />
          </div>

          <div>
            <label style={styles.label}>README Markdown Content</label>
            <textarea
              rows={6}
              placeholder="# My Package&#10;&#10;Installation: `qpm install package-name`"
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
              className="input-field"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", height: "50px", fontSize: "1.05rem", marginTop: "12px" }}
          >
            {loading ? (
              "Uploading Tarball to Google Drive & MongoDB..."
            ) : (
              <>
                <Upload size={20} />
                <span>Publish Package to QPM</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  badgeDrive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    background: "rgba(6, 182, 212, 0.1)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    color: "var(--accent-cyan)",
    fontSize: "0.85rem",
    fontWeight: "600"
  },
  warningBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(245, 158, 11, 0.12)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "var(--radius-md)",
    padding: "14px 20px",
    marginBottom: "24px",
    color: "#fde68a"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "14px 20px",
    borderRadius: "var(--radius-md)",
    marginBottom: "24px",
    textAlign: "center"
  },
  successAlert: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#6ee7b7",
    padding: "14px 20px",
    borderRadius: "var(--radius-md)",
    marginBottom: "24px",
    textAlign: "center",
    fontWeight: "600"
  },
  formCard: {
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "var(--text-muted)",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  },
  dropZone: {
    border: "2px dashed var(--border-light)",
    borderRadius: "var(--radius-md)",
    padding: "24px",
    textAlign: "center",
    position: "relative",
    cursor: "pointer",
    background: "rgba(15, 23, 42, 0.5)",
    transition: "all var(--transition-fast)"
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%"
  }
};
