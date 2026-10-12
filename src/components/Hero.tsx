import Image from "next/image";
import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";
import { formatDotDate, formatKoreanTime } from "@/lib/date";

export default function Hero() {
  const { groom, bride, venue, hero } = wedding;
  return (
    <section className="hero">
      <p className="hero__eyebrow">WE ARE GETTING MARRIED</p>
      <div className="hero__photo">
        <Image src={asset(hero.image)} alt={`${groom.name}, ${bride.name}`} fill priority sizes="(max-width: 480px) 100vw, 480px" />
      </div>
      <h1 className="hero__names">
        {groom.name}
        <span className="hero__amp">&amp;</span>
        {bride.name}
      </h1>
      <p className="hero__meta">
        {formatDotDate()} · {formatKoreanTime()}
        <br />
        {venue.name}
      </p>
    </section>
  );
}
