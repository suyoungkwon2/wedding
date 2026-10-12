"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  images: string[]; // 크게 볼 이미지 경로
  thumbs: string[]; // 하단 슬라이더용 썸네일 경로
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 50; // px 이상 끌면 다음/이전 사진
const DRAG_ELASTIC = 0.7; // 손가락 이동 대비 사진 이동 비율
const CLOSE_MS = 250;

/** Framer "Interactive Gallery" 라이트박스 구조: 상단 닫기 / 가운데 사진 + 좌우 버튼 / 하단 카운터 + 썸네일 슬라이더 */
export default function Lightbox({ images, thumbs, index, onIndexChange, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback((step: number) => onIndexChange((index + step + count) % count), [index, count, onIndexChange]);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, CLOSE_MS);
  }, [onClose]);

  // 키보드, 배경 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  useEffect(() => {
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      [html.style.overflow, document.body.style.overflow] = prev;
    };
  }, []);

  // 선택된 썸네일을 슬라이더 가운데로
  useLayoutEffect(() => {
    const strip = thumbsRef.current;
    const active = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !active) return;
    strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  // 앞뒤 사진 미리 불러오기
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const img = new window.Image();
      img.src = images[(i + count) % count];
    });
  }, [index, images, count]);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return createPortal(
    <div className={`lb ${closing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={close}>
      <div className="lb__inner">
        <div className="lb__top">
          <button type="button" className="lb__btn lb__close" onClick={close} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          className="lb__stage"
          onTouchStart={(e) => {
            startX.current = e.touches[0].clientX;
            setDragging(true);
          }}
          onTouchMove={(e) => {
            if (startX.current !== null) setDragX((e.touches[0].clientX - startX.current) * DRAG_ELASTIC);
          }}
          onTouchEnd={(e) => {
            if (startX.current === null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            startX.current = null;
            setDragging(false);
            setDragX(0);
            if (dx < -SWIPE_THRESHOLD) go(1);
            else if (dx > SWIPE_THRESHOLD) go(-1);
          }}
        >
          {count > 1 && (
            <button type="button" className="lb__btn lb__nav lb__nav--prev" onClick={(e) => { stop(e); go(-1); }} aria-label="이전 사진">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className={`lb__drag ${dragging ? "is-dragging" : ""}`} style={{ transform: `translateX(${dragX}px)` }}>
            {/* key 로 사진이 바뀔 때마다 등장 애니메이션 재생 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={index} className="lb__image" src={images[index]} alt={`사진 ${index + 1}`} onClick={stop} draggable={false} />
          </div>

          {count > 1 && (
            <button type="button" className="lb__btn lb__nav lb__nav--next" onClick={(e) => { stop(e); go(1); }} aria-label="다음 사진">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        <div className="lb__bottom" onClick={stop}>
          <p className="lb__count">
            {index + 1} / {count}
          </p>
          {count > 1 && (
            <div className="lb__thumbs" ref={thumbsRef}>
              {thumbs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`lb__thumb ${i === index ? "is-active" : ""}`}
                  onClick={() => onIndexChange(i)}
                  aria-label={`사진 ${i + 1}`}
                  aria-current={i === index}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
