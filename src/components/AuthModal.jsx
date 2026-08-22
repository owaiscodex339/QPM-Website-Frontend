import React, { useState } from "react";
import { X, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email || username, password);
      } else {
        await signup(username, email, password, bio);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <ShieldCheck size={28} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", marginTop: "10px" }}>
            {mode === "login" ? "Welcome Back to QPM" : "Create your QPM Account"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {mode === "login"
              ? "Access your published packages and API tokens"
              : "Start publishing packages stored safely in Google Drive"}
          </p>
        </div>

        {/* Error Alert */}
        {error && <div style={styles.errorAlert}>{error}</div>}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "signup" && (
            <div>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  placeholder="e.g. quantumdev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={styles.label}>
              {mode === "login" ? "Email or Username" : "Email Address"}
            </label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type={mode === "login" ? "text" : "email"}
                required
                placeholder={mode === "login" ? "username or email@domain.com" : "you@domain.com"}
                value={mode === "login" ? (email || username) : email}
                onChange={(e) => {
                  if (mode === "login") {
                    setEmail(e.target.value);
                    setUsername(e.target.value);
                  } else {
                    setEmail(e.target.value);
                  }
                }}
                className="input-field"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label style={styles.label}>Bio / Short Description (Optional)</label>
              <input
                type="text"
                placeholder="Quantum language contributor & developer"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-field"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "12px", height: "46px" }}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div style={styles.switchFooter}>
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                style={styles.switchBtn}
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                style={styles.switchBtn}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(5, 8, 15, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px"
  },
  modal: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "440px",
    padding: "32px",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    textAlign: "center",
    marginBottom: "24px"
  },
  iconCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    fontSize: "0.85rem",
    marginBottom: "16px",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-muted)",
    marginBottom: "6px"
  },
  inputWrapper: {
    position: "relative"
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    pointerEvents: "none"
  },
  switchFooter: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    borderTop: "1px solid var(--border-light)",
    paddingTop: "16px"
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "var(--accent-cyan)",
    fontWeight: "700",
    cursor: "pointer"
  }
};
