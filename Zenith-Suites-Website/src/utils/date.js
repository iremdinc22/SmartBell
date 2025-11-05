// src/utils/date.js

// İki tarih arasındaki gece sayısını hesaplar
export function nightsBetween(d1, d2) {
  if (!d1 || !d2) return 0;
  const start = new Date(d1);
  const end = new Date(d2);
  const diffMs = end - start;
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
}

// Tarihi "YYYY-MM-DD" formatına çevirir (isteğe bağlı kullanılabilir)
export function toYMD(input) {
  const date = new Date(input);
  if (isNaN(date.getTime())) return input;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
