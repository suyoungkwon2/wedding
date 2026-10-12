"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type NaverMaps = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
  Marker: new (opts: { position: unknown; map: unknown }) => unknown;
};

declare global {
  interface Window {
    naver?: { maps: NaverMaps };
  }
}

const KEY = process.env.NEXT_PUBLIC_NAVER_MAP_KEY;

export default function NaverMap({ lat, lng }: { lat: number; lng: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !ref.current || !window.naver) return;
    const { maps } = window.naver;
    const center = new maps.LatLng(lat, lng);
    const map = new maps.Map(ref.current, {
      center,
      zoom: 16,
      // 페이지 스크롤을 방해하지 않도록 지도 조작은 막고 미리보기로만 사용
      draggable: false,
      pinchZoom: false,
      scrollWheel: false,
      keyboardShortcuts: false,
      disableDoubleTapZoom: true,
      disableDoubleClickZoom: true,
      disableTwoFingerTapZoom: true,
    });
    new maps.Marker({ position: center, map });
  }, [loaded, lat, lng]);

  if (!KEY) return null;

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${KEY}`}
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div ref={ref} className="map" />
    </>
  );
}
