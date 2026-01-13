import { api } from "@/lib/api";

export function getAccountSummary(params) {
  const email = (params?.email ?? "").trim().toLowerCase();
  const bookingCode = (params?.bookingCode ?? "").trim().toUpperCase();
  return api.get("/account/summary", { email, bookingCode }); // ✅ 2.param object
}

export function updatePersonalInfo(params, dto) {
  const email = (params?.email ?? "").trim().toLowerCase();
  const bookingCode = (params?.bookingCode ?? "").trim().toUpperCase();
  // fetch wrapper put(url, json) -> params desteklemiyor
  // bu yüzden query’yi URL’e ekliyoruz:
  return api.put(
    `/account/personal-info?${new URLSearchParams({ email, bookingCode })}`,
    dto
  );
}
