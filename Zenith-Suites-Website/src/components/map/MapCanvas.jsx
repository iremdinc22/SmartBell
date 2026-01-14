import { useEffect, useMemo, useRef, useState } from "react";
import { fetchMapMeta } from "@/services/map";

// Dünyadan Piksele (Çizim için)
function worldToPixel(x, y, meta) {
  const gx = (x - meta.originX) / meta.resolution;
  const gy = (y - meta.originY) / meta.resolution;
  return { px: gx, py: gy };
}

// ✅ Piskelden Dünyaya (Tıklama Koordinatı için)
function pixelToWorld(mx, my, meta) {
  const realX = mx * meta.resolution + meta.originX;
  const realY = my * meta.resolution + meta.originY;
  return { realX, realY };
}

export default function MapCanvas({
  robots = [],
  selectedRobotId = null,
  onRobotClick = () => {},
  onMapClick = null, // ✅ Dışarıdan gelen tıklama prop'u
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [img, setImg] = useState(null);
  const [view, setView] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [size, setSize] = useState({ w: 1100, h: 700 });

  // 1) Meta ve Resim Yükleme (Kodun aynen kalıyor...)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMapMeta();
        const m = res?.data ?? res;
        if (!m || !m.pngUrl) return;
        const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5131/api").replace(/\/api\/?$/, "");
        const pngUrl = m.pngUrl.startsWith("http") ? m.pngUrl : `${apiBase}${m.pngUrl}`;
        const metaFixed = { ...m, pngUrl };
        setMeta(metaFixed);
        const image = new Image();
        image.src = pngUrl + "?v=" + Date.now();
        image.onload = () => setImg(image);
      } catch (err) { console.error(err); }
    })();
  }, []);

  // 2) Otomatik Hizalama (Kodun aynen kalıyor...)
  const fitAndCenter = useMemo(() => (w, h, m) => {
    const pad = 24;
    const s = Math.min((w - pad * 2) / m.width, (h - pad * 2) / m.height);
    return { scale: s, offsetX: (w - m.width * s) / 2, offsetY: (h - m.height * s) / 2 };
  }, []);

  useEffect(() => {
    if (meta) setView(fitAndCenter(size.w, size.h, meta));
  }, [meta, size.w, size.h, fitAndCenter]);

  // Container Boyutu (ResizeObserver kısmın...)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries?.[0]?.contentRect;
      if (cr) setSize({ w: Math.max(300, cr.width), h: Math.max(300, cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 3) Çizim Döngüsü (Kodun aynen kalıyor...)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !meta || !img) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr; canvas.height = size.h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.save();
    ctx.translate(view.offsetX, view.offsetY);
    ctx.scale(view.scale, view.scale);
    ctx.drawImage(img, 0, 0);
    
    robots.forEach(r => {
      if (!r.pose) return;
      const { px, py } = worldToPixel(r.pose.x, r.pose.y, meta);
      ctx.beginPath();
      ctx.arc(px, py, r.id === selectedRobotId ? 10 : 7, 0, Math.PI * 2);
      ctx.fillStyle = r.color || "#3b82f6";
      ctx.fill();
    });
    ctx.restore();
  }, [meta, img, robots, selectedRobotId, view, size]);

  // ===============================
  // 4) GÜNCELLENMİŞ TIKLAMA MANTIĞI
  // ===============================
  function onClick(e) {
    if (!meta) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    // Ekran piksellerini Harita piksellerine çevir
    const mx = (cx - view.offsetX) / view.scale;
    const my = (cy - view.offsetY) / view.scale;

    // 1. Önce robot seçilmeye çalışılıyor mu bak:
    let best = null;
    let bestDist = Infinity;
    for (const r of robots) {
      if (!r.pose) continue;
      const { px, py } = worldToPixel(r.pose.x, r.pose.y, meta);
      const d = Math.sqrt((px - mx)**2 + (py - my)**2);
      if (d < bestDist) { bestDist = d; best = r; }
    }

    if (best && bestDist <= 20) {
      // Robot tıklandı
      onRobotClick(best);
    } else if (onMapClick) {
      // ✅ Boş harita tıklandı -> Metre koordinatlarını hesapla ve gönder
      const { realX, realY } = pixelToWorld(mx, my, meta);
      console.log(`📍 Harita Hedefi (Metre): X=${realX.toFixed(2)}, Y=${realY.toFixed(2)}`);
      onMapClick(realX, realY);
    }
  }

  return (
    <div ref={wrapRef} className="w-full h-full bg-[#0b0f14] overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={onClick}
          className="cursor-crosshair active:cursor-grabbing"
        />
    </div>
  );
}

