import { useEffect, useMemo, useRef, useState } from "react";
import { fetchMapMeta } from "@/services/map";

function worldToPixel(x, y, meta) {
  const gx = (x - meta.originX) / meta.resolution;
  const gy = (y - meta.originY) / meta.resolution;

  const px = gx;
  const py = gy;
  return { px, py };
}

export default function MapCanvas({
  robots = [], // [{ id, name, color, pose:{x,y,yaw} }]
  selectedRobotId = null,
  onRobotClick = () => {},
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  const [meta, setMeta] = useState(null);
  const [img, setImg] = useState(null);

  // view: scale + offset (MERKEZLEME için)
  const [view, setView] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  // container size (responsive)
  const [size, setSize] = useState({ w: 1100, h: 700 });

  // ===============================
  // 0) WRAP SIZE OBSERVER (responsive)
  // ===============================
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries?.[0]?.contentRect;
      if (!cr) return;
      // küçük margin/padding payı istersen burada kırpabilirsin
      setSize({ w: Math.max(300, cr.width), h: Math.max(300, cr.height) });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ===============================
  // 1) META + IMAGE LOAD
  // ===============================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMapMeta();
        const m = res?.data ?? res;

        if (!m || !m.pngUrl) {
          console.error("🔴 fetchMapMeta invalid payload:", res);
          return;
        }

        const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5131/api").replace(
          /\/api\/?$/,
          ""
        );

        const pngUrl = m.pngUrl.startsWith("http") ? m.pngUrl : `${apiBase}${m.pngUrl}`;

        const metaFixed = {
          width: m.width,
          height: m.height,
          resolution: m.resolution,
          originX: m.originX,
          originY: m.originY,
          originYaw: m.originYaw,
          negate: m.negate,
          flipY: m.flipY,
          pngUrl,
        };

        setMeta(metaFixed);

        const image = new Image();
        image.src = pngUrl + "?v=" + Date.now();
        image.onload = () => setImg(image);
        image.onerror = () => console.error("🔴 map.png LOAD FAILED:", image.src);
      } catch (err) {
        console.error("🔴 fetchMapMeta FAILED:", err);
      }
    })();
  }, []);

  // ===============================
  // 2) AUTO FIT + CENTER (meta veya container değişince)
  // ===============================
  const fitAndCenter = useMemo(() => {
    return (w, h, metaObj) => {
      const pad = 24; // map çevresinde biraz nefes alanı
      const availW = Math.max(1, w - pad * 2);
      const availH = Math.max(1, h - pad * 2);

      const s = Math.min(availW / metaObj.width, availH / metaObj.height);

      // merkezlemek için offset:
      const drawnW = metaObj.width * s;
      const drawnH = metaObj.height * s;

      const offsetX = (w - drawnW) / 2;
      const offsetY = (h - drawnH) / 2;

      return { scale: s, offsetX, offsetY };
    };
  }, []);

  useEffect(() => {
    if (!meta) return;
    const next = fitAndCenter(size.w, size.h, meta);
    setView(next);
  }, [meta, size.w, size.h, fitAndCenter]);

  // ===============================
  // 3) CANVAS DRAW (HARİTA OYNAMAZ)
  // ===============================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !meta || !img) return;

    const dpr = window.devicePixelRatio || 1;

    const cssW = Math.floor(size.w);
    const cssH = Math.floor(size.h);

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // arka plan (dark ui içinde daha hoş)
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, cssW, cssH);

    // view transform
    ctx.save();
    ctx.translate(view.offsetX, view.offsetY);
    ctx.scale(view.scale, view.scale);

    // MAP
    ctx.drawImage(img, 0, 0);

    // Hafif overlay (opsiyonel, map’i “UI’ye gömer”)
    ctx.fillStyle = "rgba(30, 30, 30, 0.12)";
    ctx.fillRect(0, 0, meta.width, meta.height);

    // ROBOTS
    for (const r of robots) {
      if (!r.pose) continue;
      const { px, py } = worldToPixel(r.pose.x, r.pose.y, meta);

      // Halo
      ctx.beginPath();
      ctx.arc(px, py, r.id === selectedRobotId ? 16 : 14, 0, Math.PI * 2);
      ctx.fillStyle =
        r.id === selectedRobotId ? "rgba(59,130,246,0.30)" : "rgba(59,130,246,0.18)";
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(px, py, r.id === selectedRobotId ? 8 : 6, 0, Math.PI * 2);
      ctx.fillStyle = r.color || "#A8F5B4";
      ctx.fill();

      // Outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.stroke();

      // Heading
      const len = 18;
      const dx = Math.cos(r.pose.yaw || 0) * len;
      const dy = Math.sin(r.pose.yaw || 0) * len;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx, py + dy);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.stroke();
    }

    ctx.restore();
  }, [meta, img, robots, selectedRobotId, view, size.w, size.h]);

  // ===============================
  // 4) CLICK SELECT (HARİTA SABİT KALIR)
  // ===============================
  function onClick(e) {
    if (!meta) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    // ekrandan map-space’e
    const mx = (cx - view.offsetX) / view.scale;
    const my = (cy - view.offsetY) / view.scale;

    let best = null;
    let bestDist = Infinity;

    for (const r of robots) {
      if (!r.pose) continue;
      const { px, py } = worldToPixel(r.pose.x, r.pose.y, meta);
      const dx = px - mx;
      const dy = py - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist) {
        bestDist = d;
        best = r;
      }
    }

    if (best && bestDist <= 18) onRobotClick(best);
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* İstersen bu butonları da kaldırabiliriz; harita oynamıyor zaten */}
      <div className="flex gap-2 mb-3">
        <button
          className="px-3 py-1 rounded bg-white/10 border border-white/10"
          onClick={() => {
            if (!meta) return;
            const next = fitAndCenter(size.w, size.h, meta);
            setView(next);
          }}
        >
          Fit
        </button>
      </div>

      <div
        ref={wrapRef}
        className="flex-1 rounded-lg border border-white/10 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onClick={onClick}
          style={{ cursor: "default" }}
        />
      </div>
    </div>
  );
}
