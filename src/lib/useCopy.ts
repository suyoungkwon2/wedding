"use client";

import { useCallback, useState } from "react";

export function useCopy() {
  const [message, setMessage] = useState<string | null>(null);

  const copy = useCallback(async (text: string, done = "복사되었습니다") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 일부 인앱 브라우저(카카오톡 등) 대응
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setMessage(done);
    window.setTimeout(() => setMessage(null), 1800);
  }, []);

  return { copy, message };
}
