"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";
import Reveal from "./Reveal";

const INITIAL_COUNT = 9;
const full = (file: string) => asset(`/images/gallery/${file}`);
const thumb = (file: string) => asset(`/images/gallery/thumb/${file}`);

export default function Gallery() {
  const images = wedding.gallery;
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const visible = expanded ? images : images.slice(0, INITIAL_COUNT);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (step: number) => setIndex((i) => (i === null ? i : (i + step + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, move]);

  return (
    <section className="section">
      <Reveal>
        <p className="section__label">GALLERY</p>
        <h2 className="section__title">우리의 순간</h2>
        <div className="gallery">
          {visible.map((src, i) => (
            <button key={src} type="button" className="gallery__item" onClick={() => setIndex(i)} aria-label={`사진 ${i + 1} 크게 보기`}>
              <Image src={thumb(src)} alt="" fill sizes="160px" />
            </button>
          ))}
        </div>
        {images.length > INITIAL_COUNT && (
          <button type="button" className="text-button" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "접기" : "사진 더보기"}
          </button>
        )}
      </Reveal>

      {index !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="lightbox__top">
            <span>
              {index + 1} / {images.length}
            </span>
            <button type="button" className="lightbox__close" onClick={close} aria-label="닫기">
              ✕
            </button>
          </div>
          <div className="lightbox__image" onClick={(e) => e.stopPropagation()}>
            <Image src={full(images[index])} alt={`사진 ${index + 1}`} fill sizes="480px" style={{ objectFit: "contain" }} />
          </div>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="이전 사진">‹</button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="다음 사진">›</button>
        </div>
      )}
    </section>
  );
}
