import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Tag, User, Copy, Check, HardDrive } from "lucide-react";

export default function PackageCard({ pkg }) {
  const [copied, setCopied] = useState(false);
  const installCmd = `qpm install ${pkg.name}`;

  const copyCommand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link to={`/package/${pkg.name}`} style={{ textDecoration: "none" }}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.pkgName}>{pkg.name}</h3>
            <span className="tag-badge" style={{ marginTop: "4px" }}>
              v{pkg.latest_version || "1.0.0"}
            </span>
          </div>

          <div style={styles.badgeDrive} title="Stored securely on Google Drive">
            <HardDrive size={14} color="var(--accent-cyan)" />
            <span>GDrive</span>
          </div>
        </div>

        <p style={styles.description}>
          {pkg.description || "No description available for this package."}
        </p>

        {pkg.keywords && pkg.keywords.length > 0 && (
          <div style={styles.tagList}>
            {pkg.keywords.slice(0, 3).map((kw, i) => (
              <span key={i} className="tag-badge tag-badge-cyan">
                #{kw}
              </span>
            ))}
          </div>
        )}

        <div style={styles.cardFooter}>
          <div style={styles.metaInfo}>
            <span style={styles.metaItem}>
              <Download size={14} color="var(--accent-emerald)" />
              {pkg.downloads || 0} downloads
            </span>
            <span style={styles.metaItem}>
              <User size={14} color="var(--text-dim)" />
              @{pkg.owner || "community"}
            </span>
          </div>

          <button onClick={copyCommand} className="btn btn-secondary btn-sm" style={styles.copyBtn}>
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
    justifyContent: "space-between"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  pkgName: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#fff"
  },
  badgeDrive: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    borderRadius: "var(--radius-sm)",
    background: "rgba(6, 182, 212, 0.1)",
    border: "1px solid rgba(6, 182, 212, 0.25)",
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "var(--accent-cyan)"
  },
  description: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    flex: "1"
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px"
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "12px",
    borderTop: "1px solid var(--border-light)"
  },
  metaInfo: {
    display: "flex",
    gap: "14px",
    fontSize: "0.8rem",
    color: "var(--text-dim)"
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  copyBtn: {
    borderRadius: "var(--radius-full)",
    padding: "4px 10px"
  }
};
