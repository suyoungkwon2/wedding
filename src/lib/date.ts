import { wedding } from "@/data/wedding";

const KST = "Asia/Seoul";
const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/** 예식일을 한국 시간 기준 연/월/일/시/분/요일로 분해 */
export function getWeddingParts() {
  const d = new Date(wedding.date);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: KST,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, hour, minute, weekday };
}

export function formatKoreanDate() {
  const { year, month, day, weekday } = getWeddingParts();
  return `${year}년 ${month}월 ${day}일 ${WEEKDAYS_KO[weekday]}요일`;
}

export function formatKoreanTime() {
  const { hour, minute } = getWeddingParts();
  const period = hour < 12 ? "오전" : hour === 12 ? "낮" : "오후";
  const h = hour > 12 ? hour - 12 : hour;
  return `${period} ${h}시${minute ? ` ${minute}분` : ""}`;
}

export function formatDotDate() {
  const { year, month, day, weekday } = getWeddingParts();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}. ${pad(month)}. ${pad(day)}. ${WEEKDAYS_EN[weekday]}`;
}

export { WEEKDAYS_KO, WEEKDAYS_EN };
