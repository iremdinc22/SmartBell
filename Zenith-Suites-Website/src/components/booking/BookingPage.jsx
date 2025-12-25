// src/pages/BookingPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateBookingForm } from "@/utils/validation";
import { nightsBetween } from "@/utils/date";
// import { checkAvailability } from "@/services/availability"; // endpoint'in varsa aç

const BookingPage = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: "2",
    children: "0",
    roomType: "any",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = validateBookingForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // --- availability endpoint'in yoksa: doğrudan Payment'a geç ---
      navigate("/payment", {
        state: {
          bookingData: {
            ...formData,
            nights: nightsBetween(formData.checkIn, formData.checkOut),
            // varsa price/currency gibi ek özetleri de burada belirleyebilirsin
          },
        },
      });

      // --- availability endpoint'in varsa (örnek) ---
      // const payload = {
      //   checkIn: formData.checkIn,
      //   checkOut: formData.checkOut,
      //   adults: Number(formData.adults),
      //   childrenUnder12: Number(formData.children),
      //   roomPreference: formData.roomType === "any" ? "Any" : formData.roomType,
      // };
      // const res = await checkAvailability(payload); // { available, total, currency, suggestedType, nights }
      // if (!res?.available) {
      //   alert("Bu tarihlerde uygun oda yok.");
      //   return;
      // }
      // navigate("/payment", {
      //   state: {
      //     bookingData: {
      //       ...formData,
      //       nights: res.nights ?? nightsBetween(formData.checkIn, formData.checkOut),
      //       price: res.total,
      //       currency: res.currency || "EUR",
      //       selectedRoomType: res.suggestedType || payload.roomPreference,
      //     },
      //   },
      // });

    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an error checking availability. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-medium text-center mb-4">
          Book Your Stay
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
          Experience unparalleled luxury and impeccable service. Select your
          dates and preferences to begin your journey at Zenith Suites.
        </p>

        <div className="bg-black border border-gray-800 p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Check-in / Check-out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="checkIn">
                  Check-in Date
                </label>
                <input
                  className={`w-full h-12 px-4 bg-black border rounded-md focus:ring-1 focus:ring-white focus:border-white transition-colors text-white ${
                    errors.checkIn ? "border-red-500" : "border-gray-700"
                  }`}
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  required
                />
                {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="checkOut">
                  Check-out Date
                </label>
                <input
                  className={`w-full h-12 px-4 bg-black border rounded-md focus:ring-1 focus:ring-white focus:border-white transition-colors text-white ${
                    errors.checkOut ? "border-red-500" : "border-gray-700"
                  }`}
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  required
                />
                {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
              </div>
            </div>

            {/* Adults / Children */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="adults">
                  Number of People
                </label>
                <select
                  className={`w-full h-12 px-4 bg-black border rounded-md focus:ring-1 focus:ring-white focus:border-white transition-colors text-white appearance-none ${
                    errors.adults ? "border-red-500" : "border-gray-700"
                  }`}
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5 People</option>
                </select>
                {errors.adults && <p className="text-red-500 text-sm mt-1">{errors.adults}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="children">
                  Children (Under 12)
                </label>
                <select
                  className="w-full h-12 px-4 bg-black border border-gray-700 rounded-md focus:ring-1 focus:ring-white focus:border-white transition-colors text-white appearance-none"
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3">3 Children</option>
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="roomType">
                Room Preference
              </label>
              <select
                className="w-full h-12 px-4 bg-black border border-gray-700 rounded-md focus:ring-1 focus:ring-white focus:border-white transition-colors text-white appearance-none"
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="any">Any Available Room</option>
                <option value="type-a">Type A - 2-Person Suite</option>
                <option value="type-b">Type B - 3-Person Suite</option>
                <option value="type-c">Type C - 4-Person Family Suite</option>
                <option value="type-d">Type D - 5-Person Grand Suite</option>
                <option value="jacuzzi">Rooms with Private Jacuzzi</option>
                <option value="infinity-pool">Rooms with Infinity Pool</option>
                <option value="premium">Premium Suites (Jacuzzi + Pool)</option>
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                className="w-full bg-white text-black py-3 px-6 rounded-md text-base font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking Availability..." : "Check Availability"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
