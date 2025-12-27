/// src/components/payment/PaymentPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createReservation } from "@/services/reservations";
import { enrollFace } from "@/services/faceVerif";

const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state ?? null;

  // BookingPage veya Recommendations'tan gelen ortak payload
  const bookingFromState = state?.bookingData || null;

  // Only redirect when there is truly no bookingData at all
  useEffect(() => {
    if (!bookingFromState) {
      navigate("/booking", { replace: true });
    }
  }, [bookingFromState, navigate]);

  // Summary: both flows supported
  const summary = useMemo(() => {
    const roomType =
      bookingFromState?.selectedRoomType ||
      bookingFromState?.roomType ||
      bookingFromState?.roomCode ||
      "Any";

    const nights = Number(bookingFromState?.nights ?? 1) || 1;

    // price: if Recommendations passed total -> use it else fallback
    const price = Number(bookingFromState?.price ?? 2250) || 2250;

    return {
      roomType,
      roomId: bookingFromState?.roomId ?? null, // optional
      roomCode: bookingFromState?.roomCode ?? null, // optional
      checkIn: bookingFromState?.checkIn,
      checkOut: bookingFromState?.checkOut,
      adults: Number(bookingFromState?.adults ?? 2),

      // ✅ TEK ALAN: childrenUnder12
      // Eski sayfadan children gelirse kırılmasın diye fallback bıraktık
      childrenUnder12: Number(
        bookingFromState?.childrenUnder12 ?? bookingFromState?.children ?? 0
      ),

      nights,
      price,
      currency: bookingFromState?.currency ?? "EUR",
    };
  }, [bookingFromState]);

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

  const [photoFile, setPhotoFile] = useState(null); // File | null
  const [photoPreview, setPhotoPreview] = useState(""); // data URL
  const [photoError, setPhotoError] = useState("");

  const handleContactChange = (e) =>
    setContact((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleInputChange = (e) =>
    setPaymentData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Photo handlers
  const handlePhotoChange = (e) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file.");
      setPhotoFile(null);
      setPhotoPreview("");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError(`Image must be <= ${MAX_IMAGE_MB} MB.`);
      setPhotoFile(null);
      setPhotoPreview("");
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoError("");
  };

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
    if (!summary.checkIn || !summary.checkOut) return "Missing dates. Please go back and select dates.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setPhotoError("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    if (photoFile && photoFile.size > MAX_IMAGE_BYTES) {
      setPhotoError(`Image must be <= ${MAX_IMAGE_MB} MB.`);
      return;
    }

    setIsProcessing(true);

    try {
      // normalize Any checks
      const roomPref =
        String(summary.roomType || "Any").toLowerCase() === "any"
          ? "Any"
          : summary.roomType;

      // Backend'in beklediği CreateReservationDto
      const dto = {
        checkIn: summary.checkIn,   // "YYYY-MM-DD"
        checkOut: summary.checkOut, // "YYYY-MM-DD"
        adults: summary.adults,

        // ✅ burada artık childrenUnder12 kullanıyoruz
        childrenUnder12: summary.childrenUnder12,

        roomPreference: roomPref,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,

        // OPTIONAL: backend destekliyorsa
        // roomId: summary.roomId,
      };

      console.log("createReservation DTO:", dto);

      const enrollData = await createReservation(dto); // POST /api/reservations
      console.log("createReservation raw:", enrollData);

      // normalize id / bookingCode
      const reservationId =
        enrollData?.id ?? enrollData?.Id ?? enrollData?.reservationId ?? enrollData?.ReservationId ?? null;

      const bookingCode =
        enrollData?.bookingCode ??
        enrollData?.BookingCode ??
        enrollData?.booking_code ??
        enrollData?.Booking_Code ??
        null;

      console.log("Normalized ids:", { reservationId, bookingCode });

      // Face enroll (optional)
      if (photoFile) {
        try {
          if (!reservationId || !bookingCode) {
            console.warn("Skipping enroll: missing reservationId or bookingCode.");
            setPhotoError("Face enroll skipped: missing booking data from server.");
          } else {
            console.log("Calling enrollFace with:", {
              reservationId,
              bookingCode,
              fileName: photoFile.name,
            });

            const enrollResp = await enrollFace(reservationId, bookingCode, photoFile);
            console.log("enroll response:", enrollResp);
          }
        } catch (err) {
          console.error("Face enroll failed:", err);
          setPhotoError("Face enroll failed, but booking succeeded.");
        }
      }

      // navigate to confirmation
      const finalBookingCode = bookingCode ?? enrollData?.bookingCode;
      const finalReservationRef = reservationId ?? enrollData?.id;

      navigate("/confirmation", {
        state: {
          bookingId: finalBookingCode,
          bookingRef: finalReservationRef,
          total: summary.price * 1.1,
          currency: summary.currency,
        },
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Payment error.");
    } finally {
      setIsProcessing(false);
    }
  };

  // show fallback while redirecting
  if (!bookingFromState) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold">No booking data found.</p>
          <p className="text-sm text-neutral-400 mt-2">Redirecting to booking...</p>
        </div>
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

                  {/* Photo upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-neutral-300 mb-2" htmlFor="photo">
                      Upload a photo of your face — used for Face Verification
                    </label>

                    <div className="flex items-center gap-4">
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="text-sm text-neutral-300"
                      />

                      {photoPreview ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={photoPreview}
                            alt="preview"
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                          />
                          <button
                            type="button"
                            onClick={clearPhoto}
                            className="text-xs text-neutral-400 underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500">Max {MAX_IMAGE_MB} MB. JPG/PNG recommended.</p>
                      )}
                    </div>

                    {photoError && <p className="text-red-400 text-sm mt-2">{photoError}</p>}
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
                  value={`${summary.adults} Adults${
                    summary.childrenUnder12 ? `, ${summary.childrenUnder12} Children (<12)` : ""
                  }`}
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
