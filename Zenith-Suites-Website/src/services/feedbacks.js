import { api } from "@/lib/api";

// POST: Feedback submit
export function createFeedback(dto) {
  // dto: { rating, aspects, comments, stayAgain }
  console.log("createFeedback dto:", dto);
  return api.post("/Feedbacks", dto);
}

// GET: Admin listeleme (aynı endpoint)
export function getFeedbacks() {
  return api.get("/Feedbacks");
}
