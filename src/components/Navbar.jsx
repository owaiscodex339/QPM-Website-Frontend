import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Package, Upload, User, LogOut, Box, Terminal, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div className="container" style={styles.navContainer}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <Box size={22} color="#fff" />
            </div>
            <div>
              <span style={styles.logoText}>QPM</span>
              <span style={styles.logoSubtext}>Registry</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search QPM packages (e.g., react, express, utils)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={styles.searchInput}
            />
          </form>

          {/* Nav Links */}
          <div style={styles.navActions}>
            <Link to="/explore" style={styles.navLink}>
              <Package size={18} />
              <span>Explore</span>
            </Link>

            <Link to="/publish" style={styles.navLink}>
              <Upload size={18} />
              <span>Publish</span>
            </Link>

            {user ? (
              <div style={styles.userMenu}>
                <Link to="/profile" style={styles.profileBtn}>
                  <div style={styles.avatar}>
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span style={styles.username}>@{user.username}</span>
                </Link>

                <button onClick={logout} className="btn btn-secondary btn-sm" title="Log out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => openAuth("login")} className="btn btn-secondary btn-sm">
                  Log In
                </button>
                <button onClick={() => openAuth("signup")} className="btn btn-primary btn-sm">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </>
  );
}

const styles = {
  nav: {
    background: "rgba(9, 13, 22, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border-light)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "12px 0"
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none"
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 15px var(--primary-glow)"
  },
  logoText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.3rem",
    fontWeight: "800",
    letterSpacing: "0.05em",
    color: "#fff",
    display: "block",
    lineHeight: "1"
  },
  logoSubtext: {
    fontSize: "0.7rem",
    color: "var(--accent-cyan)",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase"
  },
  searchForm: {
    position: "relative",
    flex: "1",
    maxWidth: "520px"
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    pointerEvents: "none"
  },
  searchInput: {
    paddingLeft: "42px",
    height: "42px",
    background: "rgba(15, 23, 42, 0.7)",
    borderRadius: "var(--radius-full)"
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-heading)",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all var(--transition-fast)"
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 10px 4px 4px",
    borderRadius: "var(--radius-full)",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border-light)",
    color: "var(--text-main)",
    textDecoration: "none"
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent-purple) 0%, var(--primary) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#fff"
  },
  username: {
    fontSize: "0.85rem",
    fontWeight: "600"
  }
};
