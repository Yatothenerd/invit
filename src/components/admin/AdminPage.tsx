import React, { useEffect, useState } from "react";
import { Guest } from "../../types";

const CODE_LENGTH = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// No longer used: codes are now random and come from the backend

const AdminPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [codes, setCodes] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/guests");
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json();
        // Defensive: handle both array and object response for backward compatibility
        if (Array.isArray(data)) {
          setGuests(data);
          setCodes({});
        } else {
          setGuests(data.guests || []);
          setCodes(data.codes || {});
        }
      } catch (err: any) {
        console.error("Error fetching guest names:", err);
        setError("Failed to load guests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const renderGuestName = (guest: Guest) => {
    // Prefer common column names first
    const direct = guest.name || guest.Name || (guest as any).Guestname;
    if (direct) return direct as string;

    // Fallback: first non-empty string value among all columns
    const firstNonEmpty = Object.values(guest).find(
      (v) => typeof v === "string" && v.trim().length > 0
    );
    return (firstNonEmpty as string) || "(no name)";
  };

  const filteredGuests = guests.filter((g) => {
    const n = renderGuestName(g).toLowerCase();
    return n.includes(search.toLowerCase());
  });

  const buildGuestLink = (guest: Guest): string | null => {
    // Find the index of this guest in the full guests array by deep equality
    const idx = guests.findIndex(g => JSON.stringify(g) === JSON.stringify(guest));
    if (idx === -1) return null;

    // Find the code for this guest index
    const code = Object.entries(codes).find(([c, i]) => i === idx)?.[0];
    if (!code) return null;

    const origin = window.location.origin;
    return `${origin}/${code}`;
  };

  const handleCopyLink = (guest: Guest) => {
    const url = buildGuestLink(guest);
    if (!url) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => {
          alert("Link copied to clipboard");
        },
        () => {
          alert("Could not copy link");
        }
      );
    } else {
      // Fallback for very old browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        alert("Link copied to clipboard");
      } catch {
        alert("Could not copy link");
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Admin Panel
          </h1>
          <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.9rem" }}>
            Total guests: {guests.length}
          </p>
        </div>
      </header>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search guest name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {loading && <p>Loading guests...</p>}
      {error && !loading && (
        <p style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{error}</p>
      )}

      {!loading && !error && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr auto",
              padding: "0.5rem 0.75rem",
              backgroundColor: "#f9fafb",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#6b7280",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span>#</span>
            <span>Name</span>
            <span>Actions</span>
          </div>
          {filteredGuests.length === 0 ? (
            <p style={{ padding: "0.75rem", fontSize: "0.9rem", margin: 0 }}>
              No guests found.
            </p>
          ) : (
            filteredGuests.map((guest, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr auto",
                  padding: "0.5rem 0.75rem",
                  borderTop: "1px solid #f3f4f6",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "#9ca3af" }}>{index + 1}</span>
                <span>{renderGuestName(guest)}</span>
                <span style={{ textAlign: "right", display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const url = buildGuestLink(guest);
                      if (!url) return;
                      window.open(url, "_blank");
                    }}
                    style={{
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.8rem",
                      borderRadius: 9999,
                      border: "1px solid #d1d5db",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(guest)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.8rem",
                      borderRadius: 9999,
                      border: "1px solid #d1d5db",
                      backgroundColor: "#f9fafb",
                      cursor: "pointer",
                    }}
                  >
                    Copy
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;