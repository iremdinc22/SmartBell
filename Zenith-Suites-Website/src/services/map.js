import { api } from "@/lib/api";

// Harita metadata (resolution, origin, width, height, pngUrl vs.)
export function fetchMapMeta() {
  return api.get("/maps/meta");
}

/*
// (İleride) robot pose'ları backend'den almak için
export function fetchRobotPoses() {
  return api.get("/robots/poses");
}
*/
// (İleride) belirli bir robotun pose'unu backend'den almak için