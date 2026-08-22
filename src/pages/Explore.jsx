import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Box, RefreshCw } from "lucide-react";
import PackageCard from "../components/PackageCard";

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("all");

  const popularTags = ["quantum", "core", "math", "express", "react", "utils", "networking"];

  const fetchPackages = async (term = "") => {
    setLoading(true);
    try {
      const url = term ? `/api/registry/search?q=${encodeURIComponent(term)}` : "/api/registry/search";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.objects || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm(queryParam);
    fetchPackages(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
  };

  const handleTagClick = (tag) => {
    if (tag === activeTag) {
      setActiveTag("all");
      setSearchParams({});
    } else {
      setActiveTag(tag);
      setSearchTerm(tag);
      setSearchParams({ q: tag });
    }
  };

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.4rem" }}>Explore QPM Packages</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Search and discover open-source Quantum Language libraries
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="glass-card" style={styles.searchCard}>
          <form onSubmit={handleSearchSubmit} style={styles.searchRow}>
            <div style={styles.inputWrapper}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search packages by name, description or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: "46px", height: "48px" }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: "48px" }}>
              Search
            </button>
          </form>

          {/* Quick Tags */}
          <div style={styles.tagRow}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", fontWeight: "600" }}>
              Popular tags:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag-badge ${activeTag === tag ? "tag-badge-cyan" : ""}`}
                style={{ cursor: "pointer", border: "1px solid var(--border-light)" }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Package Grid / List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: "12px" }} />
            <p>Searching QPM registry...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="glass-card" style={{ padding: "60px", textAlign: "center", marginTop: "32px" }}>
            <Box size={48} color="var(--text-dim)" style={{ marginBottom: "16px" }} />
            <h2>No packages found</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
              No matches found for "{searchTerm}". Try a different keyword or publish your own package.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "32px" }}>
            <div style={{ marginBottom: "16px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Showing {packages.length} package{packages.length === 1 ? "" : "s"}
            </div>
            <div style={styles.grid}>
              {packages.map((pkg, idx) => (
                <PackageCard key={idx} pkg={pkg} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  searchCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  searchRow: {
    display: "flex",
    gap: "16px"
  },
  inputWrapper: {
    position: "relative",
    flex: 1
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    pointerEvents: "none"
  },
  tagRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px"
  }
};
