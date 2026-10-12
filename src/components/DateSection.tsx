"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/data/wedding";
import { formatKoreanDate, formatKoreanTime, getWeddingParts, WEEKDAYS_KO } from "@/lib/date";
import Reveal from "./Reveal";

function useCountdown(target: number, weddingDayUtc: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return null;
  const diff = Math.max(0, target - now);
  // 한국 시간 기준 날짜 차이 (D-day)
  const kst = new Date(now + 9 * 3_600_000);
  const todayUtc = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
  return {
    dday: Math.round((weddingDayUtc - todayUtc) / 86_400_000),
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    past: target <= now,
  };
}

/** 구글 캘린더 일정 추가 링크 (UTC 로 변환해 넘기므로 보는 사람의 시간대에 맞게 표시됨) */
function googleCalendarUrl() {
  const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const { groom, bride, venue } = wedding;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${groom.name} ♥ ${bride.name} 결혼식`,
    dates: `${utc(wedding.date)}/${utc(wedding.endDate)}`,
    location: `${venue.name} ${venue.hall}, ${venue.address}`,
    ctz: "Asia/Seoul",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default function DateSection() {
  const { year, month, day } = getWeddingParts();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const target = new Date(wedding.date).getTime();
  const left = useCountdown(target, Date.UTC(year, month - 1, day));
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="section">
      <Reveal>
        <p className="section__label">THE DAY</p>
        <h2 className="section__title">{formatKoreanDate()}</h2>
        <p className="section__sub">{formatKoreanTime()}</p>

        <div className="inline-actions calendar-add">
          <a className="text-button" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
            <svg className="calendar-add__icon" viewBox="0 0 16 16" aria-hidden>
              <rect x="2" y="3" width="12" height="11" rx="1.5" />
              <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
            </svg>
            구글 캘린더에 추가
          </a>
        </div>

        <div className="calendar" aria-label={`${year}년 ${month}월 달력`}>
          <p className="calendar__month">{month}월</p>
          <div className="calendar__grid">
            {WEEKDAYS_KO.map((w, i) => (
              <span key={w} className={`calendar__weekday ${i === 0 ? "is-sun" : ""}`}>
                {w}
              </span>
            ))}
            {cells.map((d, i) => (
              <span
                key={i}
                className={`calendar__day ${i % 7 === 0 ? "is-sun" : ""} ${d === day ? "is-day" : ""}`}
              >
                {d ?? ""}
              </span>
            ))}
          </div>
        </div>

        {left && (
          <div className="countdown">
            <div className="countdown__units">
              {[
                ["DAYS", left.days],
                ["HOUR", pad(left.hours)],
                ["MIN", pad(left.minutes)],
                ["SEC", pad(left.seconds)],
              ].map(([label, value]) => (
                <div key={label} className="countdown__unit">
                  <span className="countdown__value">{value}</span>
                  <span className="countdown__label">{label}</span>
                </div>
              ))}
            </div>
            <p className="countdown__text">
              {left.past ? (
                <>
                  {wedding.groom.name} ♥ {wedding.bride.name}의 결혼식이 진행되었습니다.
                </>
              ) : left.dday === 0 ? (
                <>오늘은 {wedding.groom.name} ♥ {wedding.bride.name}의 결혼식날입니다.</>
              ) : (
                <>
                  {wedding.groom.name} ♥ {wedding.bride.name}의 결혼식이 <strong>{left.dday}일</strong> 남았습니다.
                </>
              )}
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
