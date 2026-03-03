import React, { useEffect, useState } from "react";
import { Guest } from "../../types";

const TelegramIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11" fill="#0ea5e9" />
    <path
      d="M17.5 7L10.5 10.1L8 9.25L7.25 9.55L9.1 11.1L8.5 14.5L9.55 13.65L11.1 12.4L14.75 14.75L17.5 7Z"
      fill="white"
    />
  </svg>
);

const MessengerIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="messengerGradient"
        x1="4"
        y1="4"
        x2="20"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#00C6FF" />
        <stop offset="50%" stopColor="#0072FF" />
        <stop offset="100%" stopColor="#FF5EBA" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#messengerGradient)" />
    <path
      d="M7.5 15.5L10.2 11.7L13 13.5L16.2 9.5L13.3 10.9L11 9.5L7.5 15.5Z"
      fill="white"
    />
  </svg>
);

const AdminPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [codes, setCodes] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [saving, setSaving] = useState(false);

  // Add guest state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [adding, setAdding] = useState(false);
  const [expandedActionsId, setExpandedActionsId] = useState<number | null>(null);
  const [isCompactActions, setIsCompactActions] = useState(false);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/guests");
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();

      const guestList: Guest[] = data.guests || [];
      setGuests(guestList);

      const codesMap: Record<string, number> = data.codes || {};
      setCodes(codesMap);
    } catch (err: any) {
      console.error("Error fetching guests:", err);
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateCompact = () => {
      setIsCompactActions(mediaQuery.matches);
    };

    updateCompact();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateCompact);
      return () => mediaQuery.removeEventListener("change", updateCompact);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateCompact);
      return () => mediaQuery.removeListener(updateCompact);
    }
  }, []);

  const renderGuestName = (guest: Guest) => {
    return guest.name || guest.Name || (guest as any).Guestname || "(no name)";
  };

  const filteredGuests = guests.filter((g) => {
    const n = renderGuestName(g).toLowerCase();
    return n.includes(search.toLowerCase());
  });

  const buildGuestLink = (guest: Guest): string | null => {
    if (!guest.code) return null;
    const origin = window.location.origin;
    return `${origin}/${guest.code}`;
  };

  // Use production domain for links that will be shared externally
  const buildGuestShareLink = (guest: Guest): string | null => {
    if (!guest.code) return null;
    const origin = window.location.origin;
    const base = origin.includes("localhost:3000")
      ? "https://invite.godyato.com"
      : origin;
    return `${base}/${guest.code}`;
  };

  const handleCopyLink = (guest: Guest) => {
    const url = buildGuestShareLink(guest);
    if (!url) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => alert("Link copied to clipboard"),
        () => alert("Could not copy link")
      );
    } else {
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

  const handleShareTelegram = (guest: Guest) => {
    const url = buildGuestShareLink(guest);
    if (!url) return;

    const text = "You're invited to our wedding!";
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
      text
    )}`;
    window.open(tgUrl, "_blank");
  };

  const handleShareMessenger = (guest: Guest) => {
    const url = buildGuestShareLink(guest);
    if (!url) return;

    const appId = "911235211757777";
    const redirectUri = window.location.origin;

    // Deep link to Messenger app (mobile devices)
    const messengerAppUrl = `fb-messenger://share?link=${encodeURIComponent(
      url
    )}&app_id=${encodeURIComponent(appId)}`;

    // Web fallback if the app cannot be opened
    const messengerWebUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      url
    )}&app_id=${encodeURIComponent(appId)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, try to open the Messenger app via deep link
      window.location.href = messengerAppUrl;
    } else {
      // On desktop, keep using the web dialog
      window.open(messengerWebUrl, "_blank");
    }
  };

  const handleStartEdit = (guest: Guest) => {
    setExpandedActionsId(null);
    setEditingId(guest.id ?? null);
    setEditName(renderGuestName(guest));
    setEditCode(guest.code || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCode("");
  };

  const handleSaveEdit = async () => {
    if (editingId === null) return;
    setSaving(true);
    try {
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, guestname: editName }),
      });

      if (!response.ok) {
        let errMsg = `Server returned ${response.status}`;
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {
          // response body wasn't JSON
        }
        throw new Error(errMsg);
      }

      setEditingId(null);
      setEditName("");
      setEditCode("");
      await fetchGuests();
    } catch (err: any) {
      console.error("Error updating guest:", err);
      alert("Failed to save changes: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleAddGuest = async () => {
    if (!newGuestName.trim()) return;
    setAdding(true);
    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestname: newGuestName.trim() }),
      });

      if (!response.ok) {
        let errMsg = `Server returned ${response.status}`;
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      setNewGuestName("");
      setShowAddForm(false);
      await fetchGuests();
    } catch (err: any) {
      console.error("Error adding guest:", err);
      alert("Failed to add guest: " + (err.message || err));
    } finally {
      setAdding(false);
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
          alignItems: "center",
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
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.85rem",
            borderRadius: 9999,
            border: "1px solid #16a34a",
            backgroundColor: showAddForm ? "#ffffff" : "#16a34a",
            color: showAddForm ? "#16a34a" : "#ffffff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showAddForm ? "Cancel" : "+ Add Guest"}
        </button>
      </header>

      {showAddForm && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            border: "1px solid #d1fae5",
            borderRadius: 8,
            backgroundColor: "#f0fdf4",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter guest name..."
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddGuest()}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="button"
            onClick={handleAddGuest}
            disabled={adding || !newGuestName.trim()}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              borderRadius: 9999,
              border: "none",
              backgroundColor: adding || !newGuestName.trim() ? "#9ca3af" : "#16a34a",
              color: "#ffffff",
              cursor: adding || !newGuestName.trim() ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      )}

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
              gridTemplateColumns: "40px minmax(0, 1.4fr) auto",
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
            filteredGuests.map((guest, index) => {
              const rowKey = guest.id ?? index;
              const isEditing = editingId === guest.id;
              const isExpanded = expandedActionsId === rowKey;
              const isCompact = isCompactActions;
              return (
                <div
                  key={rowKey}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px minmax(0, 1.4fr) auto",
                    padding: "0.5rem 0.75rem",
                    borderTop: "1px solid #f3f4f6",
                    fontSize: "0.9rem",
                    alignItems: "center",
                    backgroundColor: isEditing ? "#fffbeb" : "transparent",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>{index + 1}</span>

                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        padding: "0.15rem 0.4rem",
                        borderRadius: 4,
                        border: "1px solid #d1d5db",
                        fontSize: "0.85rem",
                        marginRight: "0.5rem",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        paddingRight: "0.25rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {renderGuestName(guest)}
                    </span>
                  )}
                  <span
                    style={{
                      textAlign: "right",
                      display: "flex",
                      gap: "0.35rem",
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={saving}
                          style={{
                            padding: "0.25rem 0.6rem",
                            fontSize: "0.8rem",
                            borderRadius: 9999,
                            border: "1px solid #16a34a",
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            cursor: saving ? "not-allowed" : "pointer",
                            opacity: saving ? 0.6 : 1,
                          }}
                        >
                          {saving ? "..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={saving}
                          style={{
                            padding: "0.25rem 0.6rem",
                            fontSize: "0.8rem",
                            borderRadius: 9999,
                            border: "1px solid #d1d5db",
                            backgroundColor: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {isCompact ? (
                          <>
                            {isExpanded && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(guest)}
                                  style={{
                                    padding: "0.25rem 0.6rem",
                                    fontSize: "0.8rem",
                                    borderRadius: 9999,
                                    border: "1px solid #3b82f6",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
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
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleShareTelegram(guest)}
                              aria-label="Share via Telegram"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                borderRadius: 9999,
                                border: "1px solid #0ea5e9",
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <TelegramIcon size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareMessenger(guest)}
                              aria-label="Share via Messenger"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                borderRadius: 9999,
                                border: "1px solid #10b981",
                                backgroundColor: "#ecfdf3",
                                color: "#047857",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MessengerIcon size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedActionsId(
                                  isExpanded ? null : rowKey
                                )
                              }
                              aria-label="More actions"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.9rem",
                                borderRadius: 9999,
                                border: "1px solid #d1d5db",
                                backgroundColor: "#f3f4f6",
                                color: "#4b5563",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              ⋯
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(guest)}
                              style={{
                                padding: "0.25rem 0.6rem",
                                fontSize: "0.8rem",
                                borderRadius: 9999,
                                border: "1px solid #3b82f6",
                                backgroundColor: "#3b82f6",
                                color: "#fff",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
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
                            <button
                              type="button"
                              onClick={() => handleShareTelegram(guest)}
                              aria-label="Share via Telegram"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                borderRadius: 9999,
                                border: "1px solid #0ea5e9",
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <TelegramIcon size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShareMessenger(guest)}
                              aria-label="Share via Messenger"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.8rem",
                                borderRadius: 9999,
                                border: "1px solid #10b981",
                                backgroundColor: "#ecfdf3",
                                color: "#047857",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MessengerIcon size={14} />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;