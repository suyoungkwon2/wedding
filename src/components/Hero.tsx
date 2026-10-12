import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";
import { getWeddingParts, WEEKDAYS_KO } from "@/lib/date";

// Figma "iPhone 17 - 2" (402px 폭) 기준 좌표. CSS에서 --u(=화면폭/402)를 곱해 비율대로 배치합니다.
// [파일, left, top, width, height, rotate(deg)] — SVG 원본 크기 기준
const SPARKLES: [string, number, number, number, number, number][] = [
  ["sparkle-3.svg", 74.44, 108.44, 14.243, 14.842, 0],
  ["sparkle-4.svg", 372.44, 234.44, 11.336, 14.842, 0],
  ["sparkle-2.svg", 361.44, 127.44, 12.007, 14.842, 0],
  ["sparkle-1.svg", 28.44, 291.44, 12.007, 14.842, 0],
  ["sparkle-5.svg", 16.69, 231.87, 11.931, 14.468, 0],
  ["sparkle-6.svg", 341.69, 196.87, 11.931, 14.468, 0],
  ["sparkle-7.svg", 19.4, 141.4, 9.944, 13.721, 0],
  ["sparkle-8.svg", 351.44, 291.44, 13.498, 14.392, 0],
  ["dash-1.svg", 312.6, 106.7, 10.175, 9.911, -48.32],
  ["dash-2.svg", 50.14, 180.83, 12.361, 8.052, 16.25],
];

const px = (n: number) => `calc(var(--u) * ${n})`;

export default function Hero() {
  const { groom, bride, venue, hero } = wedding;
  const { year, month, day, weekday } = getWeddingParts();

  return (
    <section className="hero">
      <h1 className="hero__title">
        We’re
        <br />
        Getting
        <br />
        Married!
      </h1>

      {SPARKLES.map(([file, left, top, width, height, rotate]) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={file}
          className="hero__deco"
          src={asset(`/images/hero-deco/${file}`)}
          alt=""
          aria-hidden
          style={{
            left: px(left),
            top: px(top),
            width: px(width),
            height: px(height),
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
          }}
        />
      ))}

      <p className="hero__names">
        {bride.name.split("").join(" ")}
        {"  "}
        <span className="hero__amp">&amp;</span>
        {"  "}
        {groom.name.split("").join(" ")}
      </p>

      <div className="hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(hero.image)} alt={`${bride.name}, ${groom.name}`} fetchPriority="high" />
      </div>

      {/* eslint-disable @next/next/no-img-element */}
      <img className="hero__deco hero__bow" src={asset("/images/hero-deco/bow.svg")} alt="" aria-hidden />
      <img className="hero__deco hero__doodle-right" src={asset("/images/hero-deco/doodle-right.png")} alt="" aria-hidden />
      <img className="hero__deco hero__doodle-left" src={asset("/images/hero-deco/doodle-left.png")} alt="" aria-hidden />
      {/* eslint-enable @next/next/no-img-element */}

      <p className="hero__date">
        {year} {month} {day} {WEEKDAYS_KO[weekday]}요일
      </p>
      <p className="hero__venue">
        {venue.name} {venue.hall}
      </p>
    </section>
  );
}
