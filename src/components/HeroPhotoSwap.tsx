"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

// 첫 사진에서 손끝 위치 (사진 박스 기준 비율). 파티클과 전환이 여기서 시작됩니다.
const ORIGIN = { x: 0.0, y: 0.47 };
// 사진이 화면에 다 들어오고 잠깐 뒤 전환 시작 (ms)
const TRIGGER_DELAY = 250;
// 전환 웨이브가 사진 끝까지 퍼지는 시간 (ms)
const WAVE_MS = 1900;
// 웨이브 띠 두께 (px) — 이 띠 안에서 사진이 ASCII 글자로 반짝입니다
const BAND = 70;
// ASCII 격자 칸 크기 (px)
const CELL = 7;
// 밝기 순 글자 (어두움 → 밝음)
const RAMP = " .,:;+*?%#@";
const BURST_GLYPHS = ["*", "+", "·", ".", "✦", "×", ":", "°"];
const BURST_COUNT = 140;

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; ch: string; size: number; tw: number };

export default function HeroPhotoSwap({ before, after, alt }: { before: string; after: string; alt: string }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");

  // 사진 전체가 화면 안에 들어오면 시작
  useEffect(() => {
    const photo = photoRef.current;
    if (!photo || state !== "idle") return;
    let timer = 0;
    const check = () => {
      const r = photo.getBoundingClientRect();
      const fits = r.top >= -2 && r.bottom <= window.innerHeight + 2;
      // 사진이 화면보다 큰 경우엔 대부분 보이면 시작
      const mostly = r.height > window.innerHeight && r.top <= 0 && r.bottom >= window.innerHeight * 0.9;
      if ((fits || mostly) && window.scrollY > 10) {
        if (!timer) timer = window.setTimeout(
            // 모션 줄이기 설정이면 효과 없이 바로 전환
            () => setState(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "playing"),
            TRIGGER_DELAY,
          );
      } else if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      clearTimeout(timer);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "playing") return;
    const photo = photoRef.current!;
    const img = afterRef.current!;
    const canvas = canvasRef.current!;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cRect = canvas.getBoundingClientRect();
    const pRect = photo.getBoundingClientRect();
    canvas.width = cRect.width * dpr;
    canvas.height = cRect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // 사진 박스의 캔버스 내 위치
    const px = pRect.left - cRect.left;
    const py = pRect.top - cRect.top;
    const pw = pRect.width;
    const ph = pRect.height;
    const ox = px + pw * ORIGIN.x;
    const oy = py + ph * ORIGIN.y;
    const maxR = Math.hypot(Math.max(ORIGIN.x, 1 - ORIGIN.x) * pw, Math.max(ORIGIN.y, 1 - ORIGIN.y) * ph) + BAND;

    // 바뀔 사진의 밝기 격자 (object-fit: cover 와 같은 크롭으로 샘플링)
    const cols = Math.ceil(pw / CELL);
    const rows = Math.ceil(ph / CELL);
    const lum = new Float32Array(cols * rows);
    try {
      if (!img.complete || !img.naturalWidth) throw new Error("not loaded");
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d")!;
      const s = Math.max(pw / img.naturalWidth, ph / img.naturalHeight);
      const sw = pw / s;
      const sh = ph / s;
      octx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
      const d = octx.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) lum[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
    } catch {
      lum.fill(0.6);
    }

    // 손끝에서 터지는 파티클 — 주로 오른쪽(사진 안쪽)으로 퍼짐
    const parts: Particle[] = Array.from({ length: BURST_COUNT }, () => {
      const a = (Math.random() - 0.5) * Math.PI * 1.25 + (Math.random() < 0.15 ? Math.PI : 0);
      const sp = 2 + Math.random() ** 1.4 * 12;
      const max = 60 + Math.random() * 70;
      return {
        x: ox + (Math.random() - 0.5) * 6,
        y: oy + (Math.random() - 0.5) * 6,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0,
        max,
        ch: BURST_GLYPHS[(Math.random() * BURST_GLYPHS.length) | 0],
        size: 7 + Math.random() * 9,
        tw: Math.random() * Math.PI * 2,
      };
    });

    const font = (size: number) => `${size}px ui-monospace, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const start = performance.now();
    let raf = 0;
    let doodlesShown = false;

    const frame = (now: number) => {
      const t = now - start;
      const p = Math.min(t / WAVE_MS, 1);
      // 천천히 출발 → 가속 → 감속. 파티클이 먼저 앞서 퍼지고 사진이 뒤따라 바뀜
      const eased = p * p * (3 - 2 * p);
      const R = eased * maxR;

      // 바뀔 사진: 웨이브 띠 뒤쪽부터 드러남
      const inner = Math.max(R - BAND, 0);
      const mask = `radial-gradient(circle at ${ORIGIN.x * 100}% ${ORIGIN.y * 100}%, #000 ${inner}px, transparent ${R - BAND * 0.3}px)`;
      img.style.maskImage = mask;
      img.style.webkitMaskImage = mask;

      if (!doodlesShown && p > 0.45) {
        doodlesShown = true;
        photo.parentElement?.classList.add("hero--swapped");
      }

      ctx.clearRect(0, 0, cRect.width, cRect.height);
      ctx.globalCompositeOperation = "lighter";

      // 웨이브 띠: 바뀔 사진을 ASCII 글자로
      if (p < 1) {
        ctx.font = font(CELL + 2);
        const lo = Math.max(R - BAND, 0);
        for (let r = 0; r < rows; r++) {
          const cy = py + r * CELL + CELL / 2;
          for (let c = 0; c < cols; c++) {
            const cx = px + c * CELL + CELL / 2;
            const dist = Math.hypot(cx - ox, cy - oy);
            if (dist > R || dist < lo) continue;
            // 띠 앞쪽(바깥)일수록 밝게
            const k = (dist - lo) / BAND;
            if (Math.random() > 0.35 + k * 0.6) continue;
            const l = lum[r * cols + c];
            const flick = Math.random() * 0.35;
            const ch = RAMP[Math.min(RAMP.length - 1, Math.floor((l * 0.8 + flick) * RAMP.length))];
            if (ch === " ") continue;
            ctx.fillStyle = `rgba(255,255,255,${(0.25 + 0.75 * k) * (0.6 + Math.random() * 0.4)})`;
            ctx.fillText(ch, cx, cy);
          }
        }
      }

      // 버스트 파티클
      let alive = false;
      for (const q of parts) {
        if (q.life >= q.max) continue;
        alive = true;
        q.life++;
        q.x += q.vx;
        q.y += q.vy;
        q.vx *= 0.94;
        q.vy = q.vy * 0.94 + 0.03;
        const fade = 1 - q.life / q.max;
        const twinkle = 0.55 + 0.45 * Math.sin(q.tw + q.life * 0.6);
        ctx.font = font(q.size * (0.6 + fade * 0.4));
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(255,255,255,${fade * twinkle})`;
        ctx.fillText(q.ch, q.x, q.y);
      }
      ctx.shadowBlur = 0;

      if (p < 1 || alive) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, cRect.width, cRect.height);
        setState("done");
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // 전환이 끝나면 마스크 해제
  useEffect(() => {
    if (state !== "done") return;
    const img = afterRef.current;
    if (img) {
      img.style.maskImage = "none";
      img.style.webkitMaskImage = "none";
    }
    photoRef.current?.parentElement?.classList.add("hero--swapped");
  }, [state]);

  return (
    <>
      <div className="hero__photo" ref={photoRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(before)} alt={alt} fetchPriority="high" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={afterRef}
          className="hero__photo-after"
          src={asset(after)}
          alt=""
          aria-hidden
          style={{ maskImage: "radial-gradient(circle, transparent 0, transparent 0)", WebkitMaskImage: "radial-gradient(circle, transparent 0, transparent 0)" }}
        />
      </div>
      {state === "playing" && <canvas ref={canvasRef} className="hero__swap-canvas" aria-hidden />}
    </>
  );
}
