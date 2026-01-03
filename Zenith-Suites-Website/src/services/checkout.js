// src/services/checkout.js
import { api } from "@/lib/api";

export async function checkoutWithPin(bookingCode, pin) {
  if (!bookingCode || !pin) {
    return Promise.reject(new Error("BookingCode and PIN are required."));
  }

  const payload = {
    bookingCode: bookingCode.trim().toUpperCase(),
    pin: pin.trim(),
  };

  // Backend JSON bekliyorsa:
  return api.post("/CheckOut", payload);
}
