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

// 컨페티가 퍼져나오는 시작점 (타이틀 중앙) 과, 시작 위치를 중앙 쪽으로 당기는 비율
const BURST_CENTER = { x: 201, y: 214 };
const BURST_PULL = 0.55;

const TITLE_LINES = ["We’re", "Getting", "Married!"];
const TITLE_CHARS = TITLE_LINES.join("").length;

/** 글자마다 Hand Write 애니메이션 span 으로 감쌈. 공백은 순번에서 제외해 리듬이 끊기지 않게 함 */
function HandChars({ text, start = 0, className }: { text: string; start?: number; className?: string }) {
  return (
    <span className={className} aria-hidden>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="hero__char"
          style={{ "--i": start + text.slice(0, i).replaceAll(" ", "").length } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { groom, bride, venue, hero } = wedding;
  const { year, month, day, weekday } = getWeddingParts();

  return (
    <section className="hero" style={{ "--title-chars": TITLE_CHARS } as React.CSSProperties}>
      {/* Hand Write 효과: 글자마다 순서대로 써지듯 등장 */}
      <h1 className="hero__title" aria-label={TITLE_LINES.join(" ")}>
        {TITLE_LINES.map((line, li) => {
          const offset = TITLE_LINES.slice(0, li).join("").length;
          return (
            <span key={line} className="hero__title-line" aria-hidden>
              {line.split("").map((ch, ci) => (
                <span key={ci} className="hero__char" style={{ "--i": offset + ci } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          );
        })}
      </h1>

      {/* 컨페티: 타이틀 중앙 쪽에서 제자리로 쫀득하게 퍼짐 */}
      {SPARKLES.map(([file, left, top, width, height, rotate], i) => {
        const dx = (BURST_CENTER.x - (left + width / 2)) * BURST_PULL;
        const dy = (BURST_CENTER.y - (top + height / 2)) * BURST_PULL;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={file}
            className="hero__deco hero__confetti"
            src={asset(`/images/hero-deco/${file}`)}
            alt=""
            aria-hidden
            style={
              {
                left: px(left),
                top: px(top),
                width: px(width),
                height: px(height),
                "--dx": px(dx),
                "--dy": px(dy),
                "--r": `${rotate}deg`,
                "--d": `${(i % 4) * 40}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {/* 타이틀이 다 써진 뒤 같은 Hand Write 효과로 등장 */}
      <p className="hero__names" aria-label={`${bride.name} & ${groom.name}`}>
        <HandChars text={`${bride.name.split("").join(" ")}  `} />
        <HandChars text="&" start={bride.name.length} className="hero__amp" />
        <HandChars text={`  ${groom.name.split("").join(" ")}`} start={bride.name.length + 1} />
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
