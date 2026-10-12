"use client";

import { wedding } from "@/data/wedding";
import { useCopy } from "@/lib/useCopy";
import NaverMap from "./NaverMap";
import Reveal from "./Reveal";
import Toast from "./Toast";

export default function Location() {
  const { venue } = wedding;
  const { copy, message } = useCopy();
  const q = encodeURIComponent(venue.name);

  const links = [
    { label: "네이버지도", href: venue.naverPlaceUrl },
    { label: "카카오맵", href: `https://map.kakao.com/link/map/${q},${venue.lat},${venue.lng}` },
    { label: "티맵", href: `tmap://route?goalname=${q}&goalx=${venue.lng}&goaly=${venue.lat}` },
  ];

  return (
    <section className="section">
      <Reveal>
        <p className="section__label">LOCATION</p>
        <h2 className="section__title">오시는 길</h2>
        <p className="location__venue">
          {venue.name} {venue.hall}
        </p>
        <p className="location__address">{venue.address}</p>
        <div className="inline-actions">
          <button type="button" className="text-button" onClick={() => copy(venue.address, "주소가 복사되었습니다")}>
            주소 복사
          </button>
          {venue.tel && (
            <a className="text-button" href={`tel:${venue.tel}`}>
              전화하기
            </a>
          )}
        </div>
      </Reveal>

      <NaverMap lat={venue.lat} lng={venue.lng} />

      <nav className="map-links" aria-label="지도 앱으로 길찾기">
        {links.map((l) => (
          <a key={l.label} href={l.href} {...(l.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
            {l.label}
          </a>
        ))}
      </nav>

      <Reveal>
        <dl className="transport">
          {venue.transport.map((t) => (
            <div key={t.label} className="transport__row">
              <dt>{t.label}</dt>
              <dd>
                {t.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Toast message={message} />
    </section>
  );
}
