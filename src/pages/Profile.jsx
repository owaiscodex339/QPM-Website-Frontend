import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Key, Copy, Check, Box, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PackageCard from "../components/PackageCard";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [userPackages, setUserPackages] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserPackages = async () => {
      setLoadingPkgs(true);
      try {
        const res = await fetch("/api/registry/user/my-packages", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserPackages(data.packages || []);
        }
      } catch (err) {
        console.error("Failed to fetch user packages:", err);
      } finally {
        setLoadingPkgs(false);
      }
    };

    fetchUserPackages();
  }, [user, token]);

  if (!user) {
    return (
      <div className="container" style={{ padding: "80px 0" }}>
        <div className="glass-card" style={{ padding: "48px", textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
          <h2>Access Denied</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", marginBottom: "24px" }}>
            Please log in to view your developer profile and package dashboard.
          </p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const copyToken = () => {
    navigator.clipboard.writeText(token || "");
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Profile Card Header */}
        <div className="glass-card" style={styles.headerCard}>
          <div style={styles.avatarBig}>
            {user.username.substring(0, 2).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "2rem" }}>@{user.username}</h1>
              <span className="tag-badge tag-badge-emerald">Developer</span>
            </div>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              {user.bio || "Quantum language developer & package maintainer"}
            </p>

            <div style={styles.infoMeta}>
              <span style={styles.metaItem}>
                <Mail size={14} color="var(--accent-cyan)" />
                {user.email}
              </span>
              <span style={styles.metaItem}>
                <Calendar size={14} color="var(--accent-purple)" />
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button onClick={logout} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* API Token Section */}
        <div className="glass-card" style={{ padding: "24px", marginTop: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Key size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: "1.1rem" }}>Your QPM API Authentication Token</h3>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
            Use this JWT token to authenticate package publishing via curl or QPM CLI scripts.
          </p>

          <div style={styles.tokenBox}>
            <code style={{ fontSize: "0.85rem", color: "#67e8f9", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis" }}>
              {token}
            </code>
            <button onClick={copyToken} className="btn btn-secondary btn-sm">
              {copiedToken ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              <span>{copiedToken ? "Copied Token" : "Copy Token"}</span>
            </button>
          </div>
        </div>

        {/* My Packages Section */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem" }}>My Published Packages</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Packages maintained by @{user.username}
              </p>
            </div>
            <Link to="/publish" className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Publish New Package</span>
            </Link>
          </div>

          {loadingPkgs ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading your packages...
            </div>
          ) : userPackages.length === 0 ? (
            <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
              <Box size={40} color="var(--text-dim)" style={{ marginBottom: "12px" }} />
              <h3>No packages published yet</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
                You haven't published any packages under @{user.username}.
              </p>
              <Link to="/publish" className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
                Publish Your First Package
              </Link>
            </div>
          ) : (
            <div style={styles.pkgGrid}>
              {userPackages.map((pkg, idx) => (
                <PackageCard key={idx} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerCard: {
    padding: "36px",
    display: "flex",
    alignItems: "center",
    gap: "28px"
  },
  avatarBig: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#fff",
    boxShadow: "0 0 20px var(--primary-glow)"
  },
  infoMeta: {
    display: "flex",
    gap: "20px",
    marginTop: "12px",
    fontSize: "0.85rem",
    color: "var(--text-dim)"
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  tokenBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    background: "rgba(10, 15, 26, 0.8)",
    border: "1px solid var(--border-light)",
    padding: "10px 16px",
    borderRadius: "var(--radius-md)"
  },
  pkgGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px"
  }
};
