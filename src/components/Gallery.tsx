"use client";

import Image from "next/image";
import { useState } from "react";
import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";

const INITIAL_COUNT = 9;
const full = (file: string) => asset(`/images/gallery/${file}`);
const thumb = (file: string) => asset(`/images/gallery/thumb/${file}`);

export default function Gallery() {
  const images = wedding.gallery;
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState<number | null>(null);

  const visible = expanded ? images : images.slice(0, INITIAL_COUNT);

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
        <Lightbox
          images={images.map(full)}
          thumbs={images.map(thumb)}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </section>
  );
}
