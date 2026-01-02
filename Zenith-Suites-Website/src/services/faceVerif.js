// src/services/faceVerif.js
import { api } from "@/lib/api";

/**
 * enrollFace: backend'e FormData ile enroll isteği gönderir
 * @param {string|number|null} reservationId
 * @param {string|number|null} bookingCode
 * @param {File} file
 * @returns {Promise<any>} backend'den dönen res.data
 * @returns {Promise<{status: string, message: string, score: number}>}
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

export async function verifyFace(bookingCode, file) {
  if (!bookingCode || !file) {
    return Promise.reject(new Error("BookingCode and File are required for verifyFace."));
  }

  const formData = new FormData();
  formData.append("BookingCode", bookingCode);
  formData.append("File", file);

  try {
    //const response = await api.postForm("/FaceVerif/verify", formData);  -- ESKİ
    const response = await api.postForm("/CheckIn", formData);
    console.log("Verify response from backend:", response);
    
    return response;   
  } catch (err) {
    console.error("verifyFace API error:", err);
    throw err;
  }
}

