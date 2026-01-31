import { api } from "@/lib/api";

// POST: Contact form submit
export function createInquiry(dto) {
  // dto: { name, email, subject, message }
  console.log("createInquiry dto:", dto);
  return api.post("/Inquiries", dto);
}

// GET: Admin listeleme (aynı endpoint)
export function getInquiries() {
  return api.get("/Inquiries");
}

