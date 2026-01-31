import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getFeedbacks } from "@/services/feedbacks";

function clampRating(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(5, v));
}

function Stars({ value }) {
  const rating = clampRating(value);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
        {rating}/5
      </span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200">
      {children}
    </span>
  );
}

const AdminFeedbacks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All"); // All | 5 | 4 | 3 | 2 | 1 | 0

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await getFeedbacks();
        const data = res?.data ?? res ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("getFeedbacks error:", err);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    if (!total) return { total: 0, avg: 0, yes: 0, maybe: 0, no: 0 };

    const sum = items.reduce((acc, x) => acc + clampRating(x?.rating), 0);
    const avg = sum / total;

    const yes = items.filter((x) =>
      String(x?.stayAgain || "").toLowerCase().includes("yes")
    ).length;
    const maybe = items.filter((x) =>
      String(x?.stayAgain || "").toLowerCase().includes("maybe")
    ).length;
    const no = items.filter(
      (x) => String(x?.stayAgain || "").toLowerCase() === "no"
    ).length;

    return { total, avg, yes, maybe, no };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((x) => {
      const r = clampRating(x?.rating);
      if (ratingFilter !== "All" && String(r) !== String(ratingFilter))
        return false;

      if (!q) return true;

      const tagsText = Array.isArray(x?.tags)
        ? x.tags.join(" ")
        : String(x?.tags ?? "");

      const hay = [x?.comment, x?.other, x?.stayAgain, tagsText, x?.rating]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [items, query, ratingFilter]);

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
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>

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
        <div className="mx-auto max-w-6xl flex flex-col gap-10">
          {/* Title */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-wider text-gray-900 dark:text-white">
                Feedbacks
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Guest satisfaction insights from checkout feedback form.
              </p>
            </div>

            {/* Back to Dashboard (extra inside page) */}
            <Link
              to="/admin/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Creative Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Feedbacks
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.total ? stats.avg.toFixed(1) : "0.0"}
                </p>
                <Stars value={Math.round(stats.avg)} />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stay Again
              </p>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Yes</span>
                  <b>{stats.yes}</b>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maybe</span>
                  <b>{stats.maybe}</b>
                </div>
                <div className="flex items-center justify-between">
                  <span>No</span>
                  <b>{stats.no}</b>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick Filter
              </p>
              <select
                className="mt-2 h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-0"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="All">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
                <option value="0">0 star</option>
              </select>
            </div>
          </div>

          {/* Search + Status */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </span>
              <input
                className="h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-0"
                placeholder="Search in comments, tags, stayAgain..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Total: <b>{items.length}</b>
              {query || ratingFilter !== "All" ? (
                <>
                  {" "}
                  • Filtered: <b>{filtered.length}</b>
                </>
              ) : null}
            </div>

            {loading && (
              <p className="mt-3 text-sm text-gray-500">Loading feedbacks…</p>
            )}
            {!loading && error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* List */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.length === 0 ? (
                <div className="lg:col-span-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400">
                  No feedbacks found.
                </div>
              ) : (
                filtered
                  .slice()
                  .reverse()
                  .map((x) => (
                    <div
                      key={x?.id ?? `${x?.createdAtUtc}-${x?.rating}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <Stars value={x?.rating} />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {x?.createdAtUtc ? String(x.createdAtUtc) : ""}
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                            String(x?.stayAgain).toLowerCase().includes("yes")
                              ? "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/30"
                              : String(x?.stayAgain)
                                  .toLowerCase()
                                  .includes("maybe")
                              ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30"
                              : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30"
                          }`}
                        >
                          {x?.stayAgain || "-"}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Array.isArray(x?.tags) && x.tags.length > 0 ? (
                          x.tags.map((t, idx) => (
                            <Chip key={`${t}-${idx}`}>{t}</Chip>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            No tags selected.
                          </span>
                        )}

                        {!!x?.other && <Chip>Other: {x.other}</Chip>}
                      </div>

                      {/* Comment */}
                      <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {x?.comment || "-"}
                        </p>
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

export default AdminFeedbacks;
