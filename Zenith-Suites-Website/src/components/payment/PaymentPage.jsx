/// src/components/payment/PaymentPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createReservation } from "@/services/reservations";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // BookingPage'den gelen veriler
  const bookingFromState = state?.bookingData || null;

  // Booking gelmediyse /booking'e yönlendir
  useEffect(() => {
    if (!bookingFromState) navigate("/booking", { replace: true });
  }, [bookingFromState, navigate]);

  // Özet
  const summary = {
    roomType: bookingFromState?.selectedRoomType || bookingFromState?.roomType || "Any",
    checkIn: bookingFromState?.checkIn,
    checkOut: bookingFromState?.checkOut,
    adults: Number(bookingFromState?.adults ?? 2),
    children: Number(bookingFromState?.children ?? 0),
    nights: bookingFromState?.nights ?? 1,
    price: bookingFromState?.price ?? 2250,
    currency: bookingFromState?.currency ?? "EUR",
  };

  // Form state
  const [contact, setContact] = useState({ fullName: "", email: "", phone: "" });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: "Turkey",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleContactChange = (e) =>
    setContact((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleInputChange = (e) =>
    setPaymentData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!contact.fullName || !contact.email) return "Please enter your full name and email.";
    if (!contact.phone) return "Phone required.";
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s+/g, "").length < 12)
      return "Card number looks invalid.";
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) return "Expiry must be MM/YY.";
    if (!/^\d{3,4}$/.test(paymentData.cvv)) return "CVV looks invalid.";
    if (!paymentData.cardHolder) return "Card holder required.";
    if (!paymentData.billingAddress || !paymentData.city || !paymentData.postalCode)
      return "Billing address is incomplete.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setIsProcessing(true);
    try {
      // Backend'in beklediği CreateReservationDto
      const dto = {
        checkIn: summary.checkIn,   // "YYYY-MM-DD"
        checkOut: summary.checkOut, // "YYYY-MM-DD"
        adults: summary.adults,
        childrenUnder12: summary.children,
        roomPreference: summary.roomType === "any" ? "Any" : summary.roomType,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
      };

      await createReservation(dto); // POST /api/reservations

      // Başarı: onay sayfasına geç
      navigate("/confirmation", {
        state: {
          bookingId:
            crypto?.randomUUID?.() || `BKG_${Math.random().toString(36).slice(2, 10)}`,
          bookingRef: `Z-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          total: summary.price * 1.1, // örnek vergi eklendi
          currency: summary.currency,
        },
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Payment error.");
    } finally {
      setIsProcessing(false);
    }
  };

  // booking yoksa uyarı göster (tamamen boş dönmeyelim)
  if (!bookingFromState) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        No booking data.{" "}
        <a href="/booking" style={{ textDecoration: "underline" }}>
          Go to booking
        </a>
      </div>
    );
  }

  const Row = ({ label, value, bold }) => (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-sm ${bold ? "font-bold" : "font-medium"} text-white`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Secure Payment</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact */}
              <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 md:p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950"
                      value={contact.fullName}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950"
                      value={contact.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950"
                      value={contact.phone}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Card Information */}
              <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 md:p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Card Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-2" htmlFor="expiryDate">
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300 mb-2" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="cardHolder">
                      Card Holder
                    </label>
                    <input
                      id="cardHolder"
                      name="cardHolder"
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                      value={paymentData.cardHolder}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 md:p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Billing Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="billingAddress">
                      Address
                    </label>
                    <input
                      id="billingAddress"
                      name="billingAddress"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                      value={paymentData.billingAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-2" htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                        value={paymentData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300 mb-2" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 placeholder:text-neutral-500 focus:ring-2 focus:ring-white/60 focus:border-white/60"
                        value={paymentData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="country">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="w-full h-12 px-4 rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-white/60 focus:border-white/60"
                      value={paymentData.country}
                      onChange={handleInputChange}
                    >
                      <option>Turkey</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Germany</option>
                    </select>
                  </div>
                </div>
              </section>

              {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

              <div className="flex justify-end">
                <button
                  className="w-full md:w-auto px-6 h-12 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing…" : "Confirm & Pay"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Summary */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-neutral-900/60 rounded-2xl border border-neutral-800 p-6 md:p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Booking Summary</h2>
              <div className="space-y-3">
                <Row label="Room Type" value={summary.roomType} />
                <Row label="Check-in" value={summary.checkIn} />
                <Row label="Check-out" value={summary.checkOut} />
                <Row
                  label="Guests"
                  value={`${summary.adults} Adults${summary.children ? `, ${summary.children} Children` : ""}`}
                />
                <Row label="Nights" value={summary.nights} />
              </div>

              <div className="border-t border-neutral-800 my-6" />

              <div className="space-y-3">
                <Row label="Subtotal" value={`€${summary.price.toLocaleString()}`} />
                <Row label="Taxes & Fees" value={`€${(summary.price * 0.1).toFixed(2)}`} />
                <Row label="Total" value={`€${(summary.price * 1.1).toFixed(2)}`} bold />
              </div>

              <p className="text-xs text-neutral-400 mt-6 text-center">
                By clicking "Confirm & Pay", you agree to our Terms.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
