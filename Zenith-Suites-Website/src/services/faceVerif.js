// src/services/faceVerif.js
import { api } from "@/lib/api";

/**
 * enrollFace: backend'e FormData ile enroll isteği gönderir
 * @param {string|number|null} reservationId
 * @param {string|number|null} bookingCode
 * @param {File} file
 * @returns {Promise<any>} backend'den dönen res.data
 */
export function enrollFace(reservationId, bookingCode, file) {
  if (!file) return Promise.reject(new Error("File is required for enrollFace."));

  const form = new FormData();
  if (reservationId !== undefined && reservationId !== null) form.append("ReservationId", String(reservationId));
  if (bookingCode !== undefined && bookingCode !== null) form.append("BookingCode", String(bookingCode));
  form.append("File", file);

  // Not: url burada "/FaceVerif/enroll" olmalı çünkü lib.api BASE_URL zaten "http://.../api"
  return api.postForm("/FaceVerif/enroll", form);
}
