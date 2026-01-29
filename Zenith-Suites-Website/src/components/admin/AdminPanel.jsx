import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReservations, updateReservationStatus } from "@/services/reservations";

const statusColor = {
  Confirmed: "#5E8B7E",
  Pending: "#E2B872",
  Cancelled: "#D7857B",
};

// case-insensitive normalize
function normalizeStatus(s) {
  const v = String(s ?? "").trim().toLowerCase();
  if (v === "confirmed") return "Confirmed";
  if (v === "cancelled" || v === "canceled") return "Cancelled";
  return "Pending";
}

// DateOnly: "2026-01-29" -> güvenli parse
function safeDate(dateOnly) {
  return new Date(`${dateOnly}T00:00:00`);
}

function formatDateRange(checkIn, checkOut) {
  const inDate = safeDate(checkIn);
  const outDate = safeDate(checkOut);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" });
  return `${fmt.format(inDate)} - ${fmt.format(outDate)}`;
}

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // API data
  const [reservationsRaw, setReservationsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (Şimdilik mock: device endpoint yok)
  const devices = [
    { name: "LobbyBot 01", status: "Online", battery: 98, color: "#5E8B7E" },
    { name: "Floor 3 Cleaner", status: "Online", battery: 65, color: "#E2B872" },
    { name: "Room Service Bot 04", status: "Maintenance", battery: 15, color: "#D7857B" },
    { name: "PoolBot 02", status: "Offline", battery: 0, color: "#D7857B" },
  ];

  // ✅ UPDATED fetchReservations (array + wrapper support)
  const fetchReservations = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await getReservations();
    console.log("getReservations raw response:", res);

    // ✅ res bazen direkt array geliyor, bazen axios response
    const payload = res?.data ?? res;

    // 1) Direkt array ise
    if (Array.isArray(payload)) {
      setReservationsRaw(payload);
      return;
    }

    // 2) ApiResponse wrapper: { data: [...] } / { items: [...] } / { result: [...] }
    const list = payload?.data ?? payload?.items ?? payload?.result ?? [];
    if (Array.isArray(list)) {
      setReservationsRaw(list);
      return;
    }

    // 3) Hiçbiri değilse
    console.warn("Reservations payload is not an array:", payload);
    setReservationsRaw([]);
    setError("Reservations response format is unexpected. Check API response shape.");
  } catch (e) {
    console.error("fetchReservations error:", e);
    setReservationsRaw([]);
    setError(e?.message ?? "Failed to fetch reservations.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReservations();
  }, []);

  // ✅ API -> UI map
  const reservations = useMemo(() => {
    return reservationsRaw.map((r) => {
      const status = normalizeStatus(r.status);

      const room =
        r.roomTypeSnapshot && r.roomTypeSnapshot !== "string"
          ? r.roomTypeSnapshot
          : r.roomPreference && r.roomPreference !== "string"
            ? r.roomPreference
            : "—";

      return {
        rawId: r.id, // Guid (PUT için)
        id: r.bookingCode ? `#${r.bookingCode}` : `#${String(r.id).slice(0, 8).toUpperCase()}`,
        guest: r.fullName ?? "Unknown Guest",
        dates: formatDateRange(r.checkIn, r.checkOut),
        room,
        status,
        color: statusColor[status] ?? "#999999",
      };
    });
  }, [reservationsRaw]);

  // Search filter
  const filteredReservations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reservations;

    return reservations.filter((r) => {
      return (
        r.id.toLowerCase().includes(q) ||
        r.guest.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      );
    });
  }, [reservations, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const pending = filteredReservations.filter((r) => r.status === "Pending").length;
    const confirmed = filteredReservations.filter((r) => r.status === "Confirmed").length;
    const cancelled = filteredReservations.filter((r) => r.status === "Cancelled").length;
    return { pending, confirmed, cancelled };
  }, [filteredReservations]);

  // Status Update
  const handleStatusChange = async (rawId, nextStatus) => {
    const normalized = normalizeStatus(nextStatus);

    // optimistic UI
    setReservationsRaw((prev) =>
      prev.map((x) => (x.id === rawId ? { ...x, status: normalized } : x))
    );

    try {
      await updateReservationStatus({ id: rawId, status: normalized });
    } catch (e) {
      console.error(e);
      alert("Status update failed.");
      await fetchReservations(); // revert
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 9l4 2.18v6.32L1 20v2h22v-2l-4-2.5V11.18L23 9 12 2zm-2 15.58V13.5l-4-2.18v3.5L6 15l4 2.58zm6 0L12 20l-4-2.58L12 15l4-2.76v3.5L16 13.5v4.08zM12 4.47L19.07 9 12 12.53 4.93 9 12 4.47z"></path>
          </svg>
          <h2 className="font-serif text-xl font-bold tracking-wide text-gray-900 dark:text-white">Zenith Suites</h2>
        </div>
        <Link
          to="/admin/login"
          className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-wider text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage reservations and track devices in real-time.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Reservation Panel */}
            <div className="lg:col-span-2">
              <section>
                <h2 className="font-serif text-3xl font-bold mb-6 text-gray-900 dark:text-white">Reservation Panel</h2>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.cancelled}</p>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white"
                      placeholder="Search by guest name, booking ID..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    Clear
                  </button>
                </div>

                {/* Loading / Error */}
                {loading && (
                  <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-gray-600 dark:text-gray-300">
                    Loading reservations...
                  </div>
                )}
                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Guest Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {!loading && filteredReservations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                            No reservations found.
                          </td>
                        </tr>
                      )}

                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.rawId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{reservation.id}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.guest}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.dates}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.room}</td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                              style={{ backgroundColor: reservation.color }}
                            >
                              {reservation.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <select
                              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-white"
                              value={reservation.status}
                              onChange={(e) => handleStatusChange(reservation.rawId, e.target.value)}
                              title="Update Status"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Robot Tracker */}
            <div className="lg:col-span-1">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Robot Tracker</h2>
                  <Link to="/admin/robots-location" className="text-sm text-black dark:text-white hover:underline">
                    View Map
                  </Link>
                </div>

                {/* Device List (static) */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Device List</h3>
                  <div className="space-y-4">
                    {devices.map((device, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{device.status}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <span>{device.battery > 0 ? `${device.battery}%` : "--%"}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Device section is currently static. Add /api/devices (+ SignalR telemetry) to make it real-time.
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
