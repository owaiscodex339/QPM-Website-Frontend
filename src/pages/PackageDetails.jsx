import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, HardDrive, User, Calendar, Copy, Check, ExternalLink, Code, Layers, FileText, ChevronRight } from "lucide-react";

export default function PackageDetails() {
  const { name } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("readme");
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/registry/${encodeURIComponent(name)}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Package not found");
        }
        const data = await res.json();
        setPkg(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [name]);

  const copyInstallCmd = () => {
    navigator.clipboard.writeText(`qpm install ${name}`);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
        Loading package details...
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", color: "#ef4444" }}>Package Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            The package "{name}" could not be located in the QPM Registry.
          </p>
          <Link to="/explore" className="btn btn-primary" style={{ marginTop: "24px" }}>
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const latestVer = pkg["dist-tags"]?.latest || Object.keys(pkg.versions || {})[0] || "1.0.0";
  const currentVerObj = pkg.versions?.[latestVer] || {};
  const downloadUrl = currentVerObj.dist?.tarball || `/api/registry/${pkg.name}/-/${pkg.name}-${latestVer}.tgz`;

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/explore" style={{ color: "var(--text-muted)" }}>Packages</Link>
          <ChevronRight size={14} color="var(--text-dim)" />
          <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>{pkg.name}</span>
        </div>

        {/* Top Header Card */}
        <div className="glass-card" style={styles.headerCard}>
          <div style={styles.headerLeft}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "2.4rem", fontWeight: "800" }}>{pkg.name}</h1>
              <span className="tag-badge" style={{ fontSize: "0.9rem", padding: "4px 12px" }}>
                v{latestVer}
              </span>
              <div style={styles.badgeDrive}>
                <HardDrive size={14} color="var(--accent-cyan)" />
                <span>Google Drive Storage</span>
              </div>
            </div>

            <p style={styles.headerDesc}>
              {pkg.description || "No description provided for this package."}
            </p>

            {/* Meta Tags */}
            <div style={styles.metaRow}>
              <span style={styles.metaBadge}>
                <User size={14} color="var(--accent-purple)" />
                Publisher: @{pkg.owner || "community"}
              </span>
              <span style={styles.metaBadge}>
                <Download size={14} color="var(--accent-emerald)" />
                Downloads: {pkg.downloads || 0}
              </span>
              <span style={styles.metaBadge}>
                License: {pkg.license || "MIT"}
              </span>
            </div>
          </div>

          {/* Quick Install Sidebar */}
          <div style={styles.headerRight}>
            <div style={styles.installBox}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: "700", textTransform: "uppercase" }}>
                Install Package
              </span>
              <div style={styles.cmdRow}>
                <code style={{ fontFamily: "var(--font-mono)", color: "#fff", fontSize: "0.95rem" }}>
                  qpm install {pkg.name}
                </code>
                <button onClick={copyInstallCmd} className="btn btn-secondary btn-sm">
                  {copiedCmd ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <a href={downloadUrl} download className="btn btn-primary" style={{ width: "100%", height: "44px" }}>
              <Download size={18} />
              <span>Download Tarball (.tgz)</span>
            </a>
          </div>
        </div>

        {/* Content Tabs & Main Area */}
        <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
          {/* Main Tab Content */}
          <div>
            <div style={styles.tabNav}>
              <button
                onClick={() => setActiveTab("readme")}
                style={{ ...styles.tabBtn, ...(activeTab === "readme" ? styles.tabBtnActive : {}) }}
              >
                <FileText size={16} />
                <span>README</span>
              </button>
              <button
                onClick={() => setActiveTab("versions")}
                style={{ ...styles.tabBtn, ...(activeTab === "versions" ? styles.tabBtnActive : {}) }}
              >
                <Code size={16} />
                <span>Versions ({Object.keys(pkg.versions || {}).length})</span>
              </button>
              <button
                onClick={() => setActiveTab("deps")}
                style={{ ...styles.tabBtn, ...(activeTab === "deps" ? styles.tabBtnActive : {}) }}
              >
                <Layers size={16} />
                <span>Dependencies</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="glass-card" style={{ padding: "32px", marginTop: "16px" }}>
              {activeTab === "readme" && (
                <div style={styles.readmeContent}>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-body)", lineHeight: "1.7", color: "var(--text-main)" }}>
                    {pkg.readme || `# ${pkg.name}\n\n${pkg.description || "No detailed readme available."}`}
                  </pre>
                </div>
              )}

              {activeTab === "versions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Version History</h3>
                  {Object.entries(pkg.versions || {}).map(([ver, data]) => (
                    <div key={ver} style={styles.versionItem}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>v{ver}</span>
                          {ver === latestVer && <span className="tag-badge tag-badge-cyan">latest</span>}
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          Released {pkg.time?.[ver] ? new Date(pkg.time[ver]).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                      <a href={data.dist?.tarball || downloadUrl} download className="btn btn-secondary btn-sm">
                        <Download size={14} />
                        <span>.tgz</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "deps" && (
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Package Dependencies</h3>
                  {currentVerObj.dependencies && Object.keys(currentVerObj.dependencies).length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {Object.entries(currentVerObj.dependencies).map(([dep, range]) => (
                        <div key={dep} style={styles.depItem}>
                          <span style={{ fontWeight: "600", color: "var(--accent-cyan)" }}>{dep}</span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {range}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)" }}>This package has zero dependencies.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Metadata */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="glass-card" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "1rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)" }}>
                Repository & Links
              </h4>
              {pkg.repository ? (
                <a href={pkg.repository} target="_blank" rel="noreferrer" style={styles.sideLink}>
                  <ExternalLink size={16} />
                  <span>GitHub Repository</span>
                </a>
              ) : (
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>No repository link</span>
              )}
            </div>

            <div className="glass-card" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "1rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)" }}>
                Keywords
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {pkg.keywords && pkg.keywords.length > 0 ? (
                  pkg.keywords.map((kw, i) => (
                    <span key={i} className="tag-badge tag-badge-cyan">
                      #{kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>No keywords specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    marginBottom: "20px"
  },
  headerCard: {
    padding: "36px",
    display: "flex",
    justifyContent: "space-between",
    gap: "40px",
    alignItems: "flex-start"
  },
  headerLeft: {
    flex: 1
  },
  badgeDrive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "var(--radius-sm)",
    background: "rgba(6, 182, 212, 0.12)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "var(--accent-cyan)"
  },
  headerDesc: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
    marginTop: "16px",
    marginBottom: "24px"
  },
  metaRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap"
  },
  metaBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "var(--radius-md)",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border-light)",
    fontSize: "0.85rem",
    color: "var(--text-main)"
  },
  headerRight: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  installBox: {
    background: "rgba(10, 15, 26, 0.8)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)",
    padding: "16px"
  },
  cmdRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px"
  },
  tabNav: {
    display: "flex",
    gap: "12px",
    borderBottom: "1px solid var(--border-light)",
    paddingBottom: "12px"
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontFamily: "var(--font-heading)",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "var(--radius-md)",
    transition: "all var(--transition-fast)"
  },
  tabBtnActive: {
    background: "rgba(99, 102, 241, 0.15)",
    color: "#fff",
    border: "1px solid rgba(99, 102, 241, 0.3)"
  },
  readmeContent: {
    overflowX: "auto"
  },
  versionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)"
  },
  depItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)"
  },
  sideLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--accent-cyan)",
    fontSize: "0.95rem",
    fontWeight: "600"
  }
};
