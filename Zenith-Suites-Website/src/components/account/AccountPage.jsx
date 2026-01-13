import { useMemo, useState } from "react";
import { getAccountSummary, updatePersonalInfo } from "@/services/account";

const AccountPage = () => {
  const [auth, setAuth] = useState({ email: "", bookingCode: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const canLoad = useMemo(() => {
    return auth.email.trim().length > 0 && auth.bookingCode.trim().length > 0;
  }, [auth.email, auth.bookingCode]);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuth((p) => ({ ...p, [name]: value }));
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((p) => ({ ...p, [name]: value }));
  };

  const parseApiError = (err, fallback) => {
    // fetch wrapper: throw new Error("....") -> err.message
    const msg = err?.message;
    if (msg && msg.includes('"errors"')) {
      try {
        const obj = JSON.parse(msg);
        const firstKey = Object.keys(obj.errors ?? {})[0];
        return obj.errors?.[firstKey]?.[0] || fallback;
      } catch {
        return fallback;
      }
    }
    return msg || fallback;
  };

  const loadAccount = async () => {
    if (!canLoad) return;

    setLoading(true);
    setError("");

    try {
      // ✅ fetch wrapper -> direkt dto döner
      const dto = await getAccountSummary({
        email: auth.email,
        bookingCode: auth.bookingCode,
      });

      setSummary(dto);

      setPersonalInfo({
        firstName: dto?.personalInfo?.firstName ?? "",
        lastName: dto?.personalInfo?.lastName ?? "",
        email: dto?.personalInfo?.email ?? "",
        phone: dto?.personalInfo?.phone ?? "",
      });
    } catch (err) {
      setError(parseApiError(err, "Failed to load account."));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!summary) return;

    setLoading(true);
    setError("");

    try {
      const dto = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
      };

      // ✅ fetch wrapper -> direkt updated info döner
      const updated = await updatePersonalInfo(
        { email: auth.email, bookingCode: auth.bookingCode },
        dto
      );

      setPersonalInfo((p) => ({
        ...p,
        firstName: updated?.firstName ?? p.firstName,
        lastName: updated?.lastName ?? p.lastName,
        phone: updated?.phone ?? p.phone,
        email: updated?.email ?? p.email,
      }));
    } catch (err) {
      setError(parseApiError(err, "Failed to update info."));
    } finally {
      setLoading(false);
    }
  };

  const upcoming = summary?.upcomingBookings ?? [];
  const past = summary?.pastBookings ?? [];

  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-12 flex-1 bg-gray-50/50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="font-serif text-5xl font-semibold text-black">My Account</h2>
          <p className="text-gray-600 mt-2">
            Enter your email and booking code to view your bookings.
          </p>
        </div>

        {/* AUTH BAR */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-black shadow-sm
                           focus:border-black focus:ring focus:ring-black/20"
                name="email"
                type="email"
                value={auth.email}
                onChange={handleAuthChange}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Code</label>
              <input
                className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-black shadow-sm
                           focus:border-black focus:ring focus:ring-black/20"
                name="bookingCode"
                type="text"
                value={auth.bookingCode}
                onChange={handleAuthChange}
                placeholder="ABC12345"
              />
            </div>

            <button
              onClick={loadAccount}
              disabled={!canLoad || loading}
              className="bg-black text-white hover:bg-opacity-90 transition-colors font-bold py-3 px-4 rounded-md disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load Account"}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Upcoming */}
            <section>
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Upcoming Bookings
              </h3>

              {upcoming.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h4 className="text-xl font-semibold text-black mb-2">
                    {summary ? "No upcoming bookings" : "Load your account to see bookings"}
                  </h4>
                  <p className="text-gray-600">
                    {summary ? "You don't have any upcoming bookings." : "Enter email + booking code above."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((b) => (
                    <div key={`${b.bookingCode}-${b.checkIn}`} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm text-gray-500">{b.bookingCode}</div>
                          <div className="text-xl font-semibold text-black">{b.roomTitle}</div>
                          <div className="text-gray-600">{b.subtitle}</div>
                          <div className="text-gray-600 mt-1">
                            {String(b.checkIn)} → {String(b.checkOut)} •{" "}
                            <span className="font-medium">{b.stayStatus}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            disabled={!b.canCheckIn}
                            className="px-4 py-2 rounded-md font-medium bg-black text-white disabled:opacity-40"
                          >
                            Check-in
                          </button>
                          <button
                            disabled={!b.canCheckOut}
                            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-black disabled:opacity-40"
                          >
                            Check-out
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section>
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Past Bookings
              </h3>

              {past.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h4 className="text-xl font-semibold text-black mb-2">{summary ? "No past bookings" : "—"}</h4>
                  <p className="text-gray-600">{summary ? "Your booking history will appear here." : ""}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {past.map((b) => (
                    <div key={`${b.bookingCode}-${b.checkIn}`} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-500">{b.bookingCode}</div>
                      <div className="text-xl font-semibold text-black">{b.roomTitle}</div>
                      <div className="text-gray-600">{b.subtitle}</div>
                      <div className="text-gray-600 mt-1">
                        {String(b.checkIn)} → {String(b.checkOut)} •{" "}
                        <span className="font-medium">{b.stayStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-sm sticky top-12">
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Personal Information
              </h3>

              {!summary ? (
                <p className="text-gray-600">Load your account to edit your information.</p>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-black shadow-sm
                                 focus:border-black focus:ring focus:ring-black/20"
                      name="firstName"
                      type="text"
                      value={personalInfo.firstName}
                      onChange={handlePersonalChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-black shadow-sm
                                 focus:border-black focus:ring focus:ring-black/20"
                      name="lastName"
                      type="text"
                      value={personalInfo.lastName}
                      onChange={handlePersonalChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      className="w-full h-12 px-4 rounded-md border border-gray-200 bg-gray-50 text-black"
                      type="email"
                      value={personalInfo.email}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Email can’t be edited here.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-black shadow-sm
                                 focus:border-black focus:ring focus:ring-black/20"
                      name="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={handlePersonalChange}
                    />
                  </div>

                  <button
                    disabled={loading}
                    className="bg-black text-white hover:bg-opacity-90 transition-colors w-full font-bold py-3 px-4 rounded-md disabled:opacity-60"
                    type="submit"
                  >
                    {loading ? "Saving..." : "Update Information"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
