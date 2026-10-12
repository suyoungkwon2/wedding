"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";
import { asset } from "@/lib/asset";

// 브라우저가 "사용자 동작"으로 인정해 소리 재생을 허용하는 이벤트들
const UNLOCK_EVENTS = ["pointerdown", "touchend", "click", "keydown"] as const;

export default function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  // 사용자가 직접 멈췄으면 다른 터치로 다시 재생하지 않음
  const userPausedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      if (userPausedRef.current || !audio.paused) return;
      audio.play().catch(() => {
        // 자동 재생이 막힌 경우: 다음 사용자 동작을 기다림
      });
    };

    const onInteract = (e: Event) => {
      // 음악 버튼 자체를 누른 경우는 버튼이 처리
      if (buttonRef.current?.contains(e.target as Node)) return;
      tryPlay();
    };

    const removeListeners = () => {
      UNLOCK_EVENTS.forEach((ev) => window.removeEventListener(ev, onInteract, true));
      window.removeEventListener("scroll", tryPlay);
    };

    const onPlay = () => {
      setPlaying(true);
      removeListeners();
    };
    const onPause = () => setPlaying(false);

    // 다른 앱으로 전환하면 멈췄다가, 돌아오면 이어서 재생
    let pausedByHidden = false;
    const onVisibility = () => {
      if (document.hidden && !audio.paused) {
        pausedByHidden = true;
        audio.pause();
      } else if (!document.hidden && pausedByHidden) {
        pausedByHidden = false;
        tryPlay();
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    UNLOCK_EVENTS.forEach((ev) => window.addEventListener(ev, onInteract, { capture: true, passive: true }));
    // 스크롤은 대부분의 모바일 브라우저에서 재생 허용 동작이 아니지만, 허용하는 환경을 위해 시도
    window.addEventListener("scroll", tryPlay, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    tryPlay(); // 자동 재생 시도

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      removeListeners();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!wedding.bgm) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={asset(encodeURI(wedding.bgm))} loop preload="auto" playsInline />
      <button
        ref={buttonRef}
        type="button"
        className={`bgm ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "배경음악 일시정지" : "배경음악 재생"}
        aria-pressed={playing}
      >
        <span className="bgm__bars" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>
    </>
  );
}
