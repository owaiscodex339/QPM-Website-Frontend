import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Terminal, Box, HardDrive, ShieldCheck, Zap, ArrowRight, Copy, Check, Download } from "lucide-react";
import PackageCard from "../components/PackageCard";

export default function Home() {
  const [featuredPkgs, setFeaturedPkgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/registry/search");
        if (res.ok) {
          const data = await res.json();
          setFeaturedPkgs(data.objects || []);
        }
      } catch (err) {
        console.error("Failed to load featured packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const copyCliCmd = () => {
    navigator.clipboard.writeText("qpm install quantum-core");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.badgeLabel}>
              <Zap size={14} color="var(--accent-cyan)" />
              <span>Next-Gen Package Manager for Quantum</span>
            </div>

            <h1 style={styles.heroTitle}>
              Build & Share Packages with <span className="text-gradient">QPM Registry</span>
            </h1>

            <p style={styles.heroSub}>
              Discover, install, and publish Quantum Language modules. Tarballs stored seamlessly in Google Drive, user accounts powered by MongoDB & JWT authentication.
            </p>

            {/* Terminal Command Box */}
            <div style={styles.terminalBox}>
              <div style={styles.terminalHeader}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ ...styles.dot, background: "#ff5f56" }} />
                  <div style={{ ...styles.dot, background: "#ffbd2e" }} />
                  <div style={{ ...styles.dot, background: "#27c93f" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  qpm cli v1.0.0
                </span>
              </div>
              <div style={styles.terminalBody}>
                <span style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>$</span>
                <span style={{ color: "#fff", fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                  qpm install quantum-core
                </span>
                <button onClick={copyCliCmd} style={styles.terminalCopyBtn} title="Copy command">
                  {copiedCmd ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={styles.ctaGroup}>
              <Link to="/explore" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                <span>Explore Packages</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/publish" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                <span>Publish Package</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights Section */}
      <section style={styles.featureSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={{ fontSize: "2rem" }}>Architected for High Speed & Reliability</h2>
            <p style={{ color: "var(--text-muted)" }}>Fully integrated with your QPM CLI binaries</p>
          </div>

          <div style={styles.gridFeatures}>
            <div className="glass-card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: "rgba(6, 182, 212, 0.12)", borderColor: "rgba(6, 182, 212, 0.3)" }}>
                <HardDrive size={24} color="var(--accent-cyan)" />
              </div>
              <h3 style={{ fontSize: "1.2rem" }}>Google Drive Tarball Storage</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "8px" }}>
                Package archives (`.tgz`) are uploaded directly to Google Drive via Service Account OAuth, streaming straight to `qpm` CLI upon install.
              </p>
            </div>

            <div className="glass-card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                <Box size={24} color="var(--accent-emerald)" />
              </div>
              <h3 style={{ fontSize: "1.2rem" }}>MongoDB Database</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "8px" }}>
                Package metadata, versions, download metrics, and user profiles are indexed in MongoDB for lightning-fast lookups.
              </p>
            </div>

            <div className="glass-card" style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: "rgba(168, 85, 247, 0.12)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
                <ShieldCheck size={24} color="var(--accent-purple)" />
              </div>
              <h3 style={{ fontSize: "1.2rem" }}>JWT Authentication</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "8px" }}>
                Secure password hashing with bcryptjs and JWT tokens to verify developer credentials for package publishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem" }}>Featured & Top Downloaded Packages</h2>
              <p style={{ color: "var(--text-muted)" }}>Explore modules created for Quantum</p>
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm">
              View All Packages →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading packages...
            </div>
          ) : featuredPkgs.length === 0 ? (
            <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
              <Box size={40} color="var(--text-dim)" style={{ marginBottom: "12px" }} />
              <h3>No packages published yet</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
                Be the first developer to publish a package to the QPM Registry!
              </p>
              <Link to="/publish" className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
                Publish a Package
              </Link>
            </div>
          ) : (
            <div style={styles.pkgGrid}>
              {featuredPkgs.map((pkg, idx) => (
                <PackageCard key={idx} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  heroSection: {
    padding: "80px 0 60px",
    position: "relative"
  },
  heroContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  heroContent: {
    maxWidth: "800px"
  },
  badgeLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    background: "rgba(6, 182, 212, 0.1)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    color: "var(--accent-cyan)",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "24px"
  },
  heroTitle: {
    fontSize: "3.2rem",
    lineHeight: "1.15",
    marginBottom: "20px"
  },
  heroSub: {
    fontSize: "1.15rem",
    color: "var(--text-muted)",
    maxWidth: "680px",
    margin: "0 auto 32px",
    lineHeight: "1.6"
  },
  terminalBox: {
    background: "rgba(10, 15, 26, 0.95)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)",
    maxWidth: "480px",
    margin: "0 auto 32px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)"
  },
  terminalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid var(--border-light)"
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  terminalBody: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 20px"
  },
  terminalCopyBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer"
  },
  ctaGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "16px"
  },
  featureSection: {
    padding: "60px 0"
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px"
  },
  gridFeatures: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  },
  featureCard: {
    padding: "32px"
  },
  featureIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px"
  },
  pkgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px"
  }
};
