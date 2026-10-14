"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";
import Reveal from "./Reveal";

// 한 장이 머무는 시간 (ms)
const HOLD = 2200;
// 플래시가 밝아진 뒤 사진이 바뀌는 시점 (ms) — globals.css 의 .polaroids__flash 애니메이션과 맞춤
const SWAP_AT = 70;

export default function Polaroids() {
  const photos = wedding.polaroids;
  const boxRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(0);
  const [visible, setVisible] = useState(false);

  // 화면에 보일 때만 넘어가도록
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || photos.length < 2) return;
    let swap = 0;
    const timer = window.setInterval(() => {
      setFlash((f) => f + 1);
      swap = window.setTimeout(() => setIndex((i) => (i + 1) % photos.length), SWAP_AT);
    }, HOLD);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [visible, photos.length]);

  return (
    <section className="section">
      <Reveal>
        <div className="polaroids" ref={boxRef}>
          {photos.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f}
              src={asset(`/images/gallery/${f}`)}
              alt={i === index ? "폴라로이드 사진" : ""}
              aria-hidden={i !== index}
              className={i === index ? "is-active" : undefined}
              loading="lazy"
            />
          ))}
          {flash > 0 && <span key={flash} className="polaroids__flash" aria-hidden />}
        </div>
      </Reveal>
    </section>
  );
}
