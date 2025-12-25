const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:5131/api";

function authHeader() {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { method, headers: { ...authHeader(), ...headers }, body });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }
  if (!res.ok) throw new Error(data?.message || text || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (url, params) => request(url + (params ? `?${new URLSearchParams(params)}` : "")),
  post: (url, json) => request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) }),
  put: (url, json) => request(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) }),

  postForm: (url, form) => request(url, { method: "POST", body: form }),
};



