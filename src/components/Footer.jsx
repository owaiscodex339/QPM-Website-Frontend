import React from "react";
import { Box, HardDrive, Database, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.brandCol}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={styles.iconCircle}>
              <Box size={20} color="#fff" />
            </div>
            <span style={{ fontSize: "1.2rem", fontWeight: "800", fontFamily: "var(--font-heading)" }}>
              QPM Registry
            </span>
          </div>
          <p style={styles.desc}>
            The high-performance package manager and web registry for the Quantum Language ecosystem. Powered by Express, MongoDB, & Google Drive Storage.
          </p>
        </div>

        <div style={styles.badgeGroup}>
          <div style={styles.statusBadge}>
            <Database size={16} color="var(--accent-emerald)" />
            <span>MongoDB Database Connected</span>
          </div>
          <div style={styles.statusBadge}>
            <HardDrive size={16} color="var(--accent-cyan)" />
            <span>Google Drive API Enabled</span>
          </div>
          <div style={styles.statusBadge}>
            <ShieldCheck size={16} color="var(--accent-purple)" />
            <span>JWT Security active</span>
          </div>
        </div>
      </div>

      <div style={styles.copyright}>
        <p>© 2026 QPM Ecosystem. Built with passion for Quantum Language.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "rgba(5, 8, 15, 0.95)",
    borderTop: "1px solid var(--border-light)",
    padding: "48px 0 24px",
    marginTop: "80px"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid var(--border-light)"
  },
  brandCol: {
    maxWidth: "480px"
  },
  iconCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  desc: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    marginTop: "12px"
  },
  badgeGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "var(--radius-md)",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border-light)",
    fontSize: "0.85rem",
    color: "var(--text-muted)"
  },
  copyright: {
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: "0.85rem",
    paddingTop: "24px"
  }
};
