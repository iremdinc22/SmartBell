import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getInquiries } from "@/services/inquiries";

const AdminInquiries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await getInquiries();
        const data = res?.data ?? res ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("getInquiries error:", err);
        setError("Failed to load inquiries.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((x) => {
      const hay = [x?.name, x?.email, x?.subject, x?.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [items, query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ===== HEADER (AdminPanel ile Uyumlu) ===== */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <svg
            className="h-6 w-6 text-gray-900 dark:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L1 9l4 2.18v6.32L1 20v2h22v-2l-4-2.5V11.18L23 9 12 2z" />
          </svg>
          <h2 className="font-serif text-xl font-bold tracking-wide text-gray-900 dark:text-white">
            Zenith Suites
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Back link */}
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>

          {/* Profile icon */}
          <Link
            to="/admin/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            title="Admin Dashboard"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl flex flex-col gap-10">
          {/* Page Title */}
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-wider text-gray-900 dark:text-white">
              Inquiries
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Messages submitted from the Inquiry Form.
            </p>
          </div>

          {/* Search */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </span>
              <input
                className="h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-0"
                placeholder="Search by name, email, subject or message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Total: <b>{items.length}</b>
              {query && (
                <>
                  {" "}
                  • Filtered: <b>{filtered.length}</b>
                </>
              )}
            </div>

            {loading && (
              <p className="mt-3 text-sm text-gray-500">Loading inquiries…</p>
            )}
            {!loading && error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* List */}
          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {filtered.length === 0 ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400">
                  No inquiries found.
                </div>
              ) : (
                filtered
                  .slice()
                  .reverse()
                  .map((x) => (
                    <div
                      key={x?.id ?? `${x?.email}-${x?.createdAtUtc}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                            {x?.subject || "(No subject)"}
                          </h3>
                          {x?.createdAtUtc && (
                            <span className="text-xs text-gray-500">
                              {String(x.createdAtUtc)}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <b>Name:</b> {x?.name || "-"} • <b>Email:</b>{" "}
                          {x?.email || "-"}
                        </div>

                        <div className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 p-4">
                          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {x?.message || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminInquiries;

