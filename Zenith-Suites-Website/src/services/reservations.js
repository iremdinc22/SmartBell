import { api } from "@/lib/api";

// Tümü: /api/reservations altında

export function getReservations() {
  return api.get("/reservations");
}

export function getReservation(id) {
  return api.get(`/reservations/${id}`);
}

// CreateReservationDto ile birebir alan adları:
export function createReservation(dto) {
  // dto: {
  //   checkIn: "YYYY-MM-DD",
  //   checkOut: "YYYY-MM-DD",
  //   adults: number,
  //   childrenUnder12: number,
  //   roomPreference: string,
  //   fullName: string,
  //   email?: string,
  //   phone: string
  // }
  console.log("createReservation dto:", dto);
  return api.post("/reservations", dto);
}

export function updateReservationStatus(dto) {
  // dto: { id: "GUID", status: "Approved" | "Rejected" | ... }
  return api.put("/reservations/status", dto);
}
