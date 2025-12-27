import { api } from "@/lib/api";

// Tümü: /api/recommendations altında

export function fetchRecommendations(dto) {
  // dto: RecommendRequestDto ile aynı alan adları
  // Örn: { checkIn, checkOut, adults, childrenUnder12, budgetMin?, budgetMax?, honeymoon, priority, preference, wanted, likesSpa, ... }
  return api.post("/recommendations", dto);
}
