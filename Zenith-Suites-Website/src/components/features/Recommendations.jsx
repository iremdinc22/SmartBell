import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecommendations } from "../../services/recommendations";

// Small helper: "YYYY-MM-DD"
function toIsoDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseWhy(why) {
  return (why || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// flags -> labels (your enum bits)
function amenityLabels(flags) {
  const map = [
    [1, "Jacuzzi"],
    [2, "Infinity Pool"],
    [4, "Air Conditioning"],
    [8, "Mini Bar"],
    [16, "Sea View"],
    [32, "Balcony"],
    [64, "Smart TV"],
  ];
  if (!flags) return ["None"];
  return map.filter(([bit]) => (flags & bit) === bit).map(([, label]) => label);
}

function ScorePill({ score }) {
  const s = Math.max(0, Math.min(100, Number(score || 0)));
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-500 dark:text-gray-400">Match</div>
      <div className="px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm font-semibold">
        {s.toFixed(1)}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="mt-3 h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="mt-5 h-9 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="mt-4 h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );
}

// Helper: turn number input into nullable number
function toNullableNumber(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Helper: remove null/undefined keys before sending to API
function compactPayload(obj) {
  const cleaned = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    cleaned[k] = v;
  }
  return cleaned;
}

export default function RecommendationsPage() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);
  const defaultCheckIn = useMemo(() => toIsoDate(today), [today]);
  const defaultCheckOut = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return toIsoDate(d);
  }, [today]);

  const [form, setForm] = useState({
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    adults: 2,
    childrenUnder12: 0,

    budgetMin: null,
    budgetMax: null,

    honeymoon: false,
    priority: "balanced",

    preference: 0, // Any
    wanted: 0, // None

    likesSpa: false,
    likesGym: false,
    likesTennis: false,
    likesBeach: false,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const nights = useMemo(() => {
    const a = new Date(form.checkIn);
    const b = new Date(form.checkOut);
    const diff = Math.max(
      0,
      Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
    );
    return diff || 1;
  }, [form.checkIn, form.checkOut]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const payload = compactPayload(form);
      const data = await fetchRecommendations(payload);
      setResults(Array.isArray(data) ? data : []);
    } catch (e2) {
      setErr(e2?.message ?? "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 sm:px-10 py-4">
        <div className="flex items-center gap-4 text-black dark:text-white">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                fill="currentColor"
              />
              <path
                clipRule="evenodd"
                d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold leading-tight">Zenith Suites</h2>
        </div>

        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9 text-sm font-medium text-black dark:text-white">
            <a className="hover:opacity-80" href="/">Rooms & Suites</a>
            <a className="hover:opacity-80" href="/">Dining</a>
            <a className="hover:opacity-80" href="/">Spa</a>
            <a className="hover:opacity-80" href="/">Events</a>
            <a className="hover:opacity-80" href="/contact">Contact</a>
          </div>
          <a
            href="/"
            className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90"
          >
            Book Now
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1 w-full items-center">
        <div className="flex flex-col w-full max-w-5xl flex-1 p-4 md:p-8">
          {/* Heading */}
          <div className="flex flex-col gap-3 text-center mb-8">
            <p className="font-serif text-black dark:text-white text-4xl sm:text-5xl font-normal tracking-wide">
              Room Recommendations
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal max-w-2xl mx-auto">
              Tell us your dates, budget, and preferences. We’ll suggest the best options with a transparent score and explanation.
            </p>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Form */}
            <section className="lg:col-span-2">
              <div className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <p className="font-serif text-lg text-black dark:text-white">Your Preferences</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    People:{" "}
                    <span className="font-semibold text-black dark:text-white">
                      {form.adults + form.childrenUnder12}
                    </span>{" "}
                    · Nights:{" "}
                    <span className="font-semibold text-black dark:text-white">{nights}</span>
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Check-in</label>
                        <input
                          type="date"
                          value={form.checkIn}
                          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Check-out</label>
                        <input
                          type="date"
                          value={form.checkOut}
                          onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Adults</label>
                        <input
                          type="number"
                          min={0}
                          value={form.adults}
                          onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })}
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Children (&lt;12)</label>
                        <input
                          type="number"
                          min={0}
                          value={form.childrenUnder12}
                          onChange={(e) =>
                            setForm({ ...form, childrenUnder12: Number(e.target.value) })
                          }
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Budget Min</label>
                        <input
                          type="number"
                          min={0}
                          value={form.budgetMin ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, budgetMin: toNullableNumber(e.target.value) })
                          }
                          placeholder="optional"
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">Budget Max</label>
                        <input
                          type="number"
                          min={0}
                          value={form.budgetMax ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, budgetMax: toNullableNumber(e.target.value) })
                          }
                          placeholder="optional"
                          className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Priority</label>
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                      >
                        <option value="balanced">balanced</option>
                        <option value="price">price</option>
                        <option value="features">features</option>
                      </select>
                    </div>

                    {/* Preference enum */}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Room Preference</label>
                      <select
                        value={form.preference}
                        onChange={(e) => setForm({ ...form, preference: Number(e.target.value) })}
                        className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                      >
                        <option value={0}>Any</option>
                        <option value={5}>Private Jacuzzi</option>
                        <option value={6}>Infinity Pool</option>
                        <option value={7}>Premium Suites</option>
                      </select>
                    </div>

                    {/* Wanted flags */}
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Wanted Amenities</label>
                      <select
                        value={form.wanted}
                        onChange={(e) => setForm({ ...form, wanted: Number(e.target.value) })}
                        className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-black dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                      >
                        <option value={0}>None</option>
                        <option value={1}>Jacuzzi</option>
                        <option value={2}>Infinity Pool</option>
                        <option value={3}>Jacuzzi + Infinity Pool</option>
                      </select>
                    </div>

                    {/* Honeymoon */}
                    <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        checked={form.honeymoon}
                        onChange={(e) => setForm({ ...form, honeymoon: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Honeymoon
                    </label>

                    {/* Interests */}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Interests</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={form.likesSpa}
                            onChange={(e) => setForm({ ...form, likesSpa: e.target.checked })}
                            className="h-4 w-4"
                          />
                          Spa
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={form.likesGym}
                            onChange={(e) => setForm({ ...form, likesGym: e.target.checked })}
                            className="h-4 w-4"
                          />
                          Gym
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={form.likesTennis}
                            onChange={(e) => setForm({ ...form, likesTennis: e.target.checked })}
                            className="h-4 w-4"
                          />
                          Tennis
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={form.likesBeach}
                            onChange={(e) => setForm({ ...form, likesBeach: e.target.checked })}
                            className="h-4 w-4"
                          />
                          Beach
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center rounded-lg h-11 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 disabled:opacity-60"
                    >
                      {loading ? "Finding rooms..." : "Get Recommendations"}
                    </button>

                    {err && (
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
                        {err}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </section>

            {/* Results */}
            <section className="lg:col-span-3">
              <div className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg text-black dark:text-white">Results</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {loading ? "Loading..." : `${results.length} room(s) found`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Tip: widen budget or set “Any” to see more.
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  {!err && loading && (
                    <div className="grid grid-cols-1 gap-4">
                      <SkeletonCard />
                      <SkeletonCard />
                    </div>
                  )}

                  {!err && !loading && results.length === 0 && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-200">
                      No rooms found. Try widening the budget or removing some filters.
                    </div>
                  )}

                  {!err && !loading && results.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                      {results.map((x) => {
                        const whyLines = parseWhy(x.why);
                        const tags = amenityLabels(x.room.amenities);

                        return (
                          <div
                            key={x.room.id}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div>
                                <div className="text-black dark:text-white font-semibold">
                                  {x.room.code} <span className="text-gray-400 dark:text-gray-500">—</span>{" "}
                                  {x.room.type}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Capacity: {x.room.capacity} · Status: {x.room.status} · Nights: {nights}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                  {tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-xs px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col items-start sm:items-end gap-2">
                                <ScorePill score={x.score} />
                                <div className="text-black dark:text-white font-bold">
                                  {x.pricePerNight} / night
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Total: {x.pricePerNight * nights}
                                </div>

                                {/* ✅ GO TO PAYMENT */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate("/payment", {
                                      state: {
                                        bookingData: {
                                          selectedRoomType: x.room.type,
                                          roomId: x.room.id,
                                          roomCode: x.room.code,
                                          checkIn: form.checkIn,
                                          checkOut: form.checkOut,
                                          adults: form.adults,
                                          childrenUnder12: form.childrenUnder12,
                                          nights,
                                          price: x.pricePerNight * nights,
                                          currency: "EUR",
                                        },
                                      },
                                    })
                                  }
                                  className="mt-1 flex items-center justify-center rounded-lg h-10 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90"
                                >
                                  Select room
                                </button>
                              </div>
                            </div>

                            {whyLines.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  Why this room?
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                                  {whyLines.slice(0, 5).map((w, i) => (
                                    <li key={i}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
