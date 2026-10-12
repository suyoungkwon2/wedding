/**
 * 약도 (수직·수평으로 정리한 개략도, 축척 아님)
 * 배치는 OpenStreetMap / 네이버 지도 기준:
 *  - 선릉로(남북) × 압구정로 / 도산대로 / 학동로(동서)
 *  - 학동사거리 = 도산대로 × 선릉로
 *  - 예식장·삼성스토어: 선릉로 서쪽, 학동사거리 바로 남쪽 (삼성스토어가 조금 더 북쪽)
 *  - 영동고등학교: 동쪽, 도산대로와 학동로 사이
 *  - 압구정로데오역 5번, 강남구청역 3·3-1번 출구: 모두 선릉로 서쪽 (3번이 3-1번보다 서쪽)
 */

// 블랙&화이트. 예식장 핀만 포인트 핑크(--color-point, 히어로와 동일)
const INK = "currentColor";

// 좌표 (viewBox 340 × 390)
const X = 210; // 선릉로
const Y_APGU = 64; // 압구정로
const Y_DOSAN = 176; // 도산대로
const Y_HAKDONG = 318; // 학동로

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8} ${y - 21})`}>
      <path d="M8 0C3.6 0 0 3.5 0 7.9 0 13.6 8 21 8 21s8-7.4 8-13.1C16 3.5 12.4 0 8 0Z" fill="var(--color-point)" />
      <circle cx="8" cy="7.8" r="3" fill="var(--color-bg)" />
    </g>
  );
}

function Bus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 7} ${y - 8})`} fill={INK}>
      <rect x="0" y="0" width="14" height="14" rx="3" />
      <rect x="2.2" y="2.4" width="9.6" height="5" rx="1" fill="var(--color-bg)" />
      <circle cx="4" cy="10.6" r="1.1" fill="var(--color-bg)" />
      <circle cx="10" cy="10.6" r="1.1" fill="var(--color-bg)" />
      <rect x="1.6" y="14" width="2.4" height="2.2" rx="0.6" />
      <rect x="10" y="14" width="2.4" height="2.2" rx="0.6" />
    </g>
  );
}

/** 출구 번호 네모 칸 */
function Exit({ x, y, n }: { x: number; y: number; n: string }) {
  const w = n.length > 1 ? 26 : 17;
  return (
    <g>
      <rect x={x - w / 2} y={y - 8.5} width={w} height="17" fill="var(--color-bg)" stroke={INK} strokeWidth="1" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11">
        {n}
      </text>
    </g>
  );
}

/** 랜드마크: 작은 네모 점 + 이름 */
function Spot({ x, y, label, anchor = "start" }: { x: number; y: number; label: string; anchor?: "start" | "end" | "middle" }) {
  const tx = anchor === "start" ? x + 9 : anchor === "end" ? x - 9 : x;
  const ty = anchor === "middle" ? y + 19 : y + 4.5;
  return (
    <g>
      <rect x={x - 3.5} y={y - 3.5} width="7" height="7" fill={INK} />
      <text x={tx} y={ty} textAnchor={anchor} fontSize="12">
        {label}
      </text>
    </g>
  );
}

function BadgeSB({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 22} y={y - 9} width="44" height="18" rx="9" fill={INK} />
      <text x={x} y={y + 3.4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--color-bg)">
        수인분당
      </text>
    </g>
  );
}

function Badge7({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={INK} />
      <text x={x} y={y + 3.6} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-bg)">
        7
      </text>
    </g>
  );
}

export default function RoughMap({ venueName }: { venueName: string }) {
  return (
    <figure className="rough-map">
      <svg viewBox="0 0 340 390" role="img" aria-label={`${venueName} 약도`}>
        {/* 도로 */}
        <g stroke={INK} strokeWidth="1.2" strokeLinecap="round">
          <line x1={X} y1="14" x2={X} y2="376" />
          <line x1="24" y1={Y_APGU} x2="324" y2={Y_APGU} />
          <line x1="24" y1={Y_DOSAN} x2="324" y2={Y_DOSAN} />
          <line x1="24" y1={Y_HAKDONG} x2="324" y2={Y_HAKDONG} />
        </g>

        {/* 도로명 (왼쪽 정렬) */}
        <g className="rough-map__road" fontSize="10.5">
          <text x="26" y={Y_APGU - 7}>압구정로</text>
          <text x="26" y={Y_DOSAN - 7}>도산대로</text>
          <text x="26" y={Y_HAKDONG - 7}>학동로</text>
        </g>

        {/* 압구정로데오역 (압구정로 × 선릉로) */}
        <BadgeSB x={X} y={Y_APGU} />
        <text x={X + 8} y={Y_APGU - 13} fontSize="13" fontWeight="700">
          압구정로데오역
        </text>
        <Exit x={X - 17} y={Y_APGU + 22} n="5" />

        {/* 랜드마크 */}
        <Spot x={X - 14} y={Y_DOSAN + 20} label="삼성스토어" anchor="end" />
        <Spot x={290} y={244} label="영동고등학교" anchor="middle" />

        {/* 학동사거리 (도산대로 × 선릉로) */}
        <circle cx={X} cy={Y_DOSAN} r="3.5" fill={INK} />
        <text x={X + 9} y={Y_DOSAN - 8} fontSize="12" fontWeight="700">
          학동사거리
        </text>

        {/* 예식장 */}
        <Pin x={X - 18} y={Y_DOSAN + 66} />
        <text x={X - 34} y={Y_DOSAN + 60} textAnchor="end" fontSize="17" fontWeight="700" className="rough-map__venue">
          {venueName}
        </text>

        {/* 강남구청역 (학동로 × 선릉로): 3-1번 출구 + 3번 출구 셔틀버스 */}
        <Badge7 x={X - 13} y={Y_HAKDONG} />
        <BadgeSB x={X + 20} y={Y_HAKDONG} />
        <Exit x={X - 21} y={Y_HAKDONG - 22} n="3-1" />
        <Exit x={X - 50} y={Y_HAKDONG - 22} n="3" />
        <Bus x={X - 72} y={Y_HAKDONG - 22} />
        <text x={X - 85} y={Y_HAKDONG - 18} textAnchor="end" fontSize="12" className="rough-map__shuttle">
          셔틀버스
        </text>
        <text x={X + 8} y={Y_HAKDONG + 25} fontSize="13" fontWeight="700">
          강남구청역
        </text>
      </svg>
    </figure>
  );
}
