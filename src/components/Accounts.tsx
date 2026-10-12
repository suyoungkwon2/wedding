"use client";

import { useState } from "react";
import { wedding, type Account } from "@/data/wedding";
import { useCopy } from "@/lib/useCopy";
import Reveal from "./Reveal";
import Toast from "./Toast";

function Group({ title, accounts, onCopy }: { title: string; accounts: Account[]; onCopy: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accounts__group ${open ? "is-open" : ""}`}>
      <button type="button" className="accounts__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{title}</span>
        <span className="accounts__chevron" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <ul className="accounts__list">
          {accounts.map((a) => (
            <li key={a.number} className="accounts__item">
              <div>
                <p className="accounts__who">
                  {a.role} <strong>{a.name}</strong>
                </p>
                <p className="accounts__number">
                  {a.bank} {a.number}
                </p>
              </div>
              <button type="button" className="text-button" onClick={() => onCopy(`${a.bank} ${a.number}`)}>
                복사
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Accounts() {
  const { copy, message } = useCopy();
  const onCopy = (t: string) => copy(t, "계좌번호가 복사되었습니다");
  return (
    <section className="section">
      <Reveal>
        <p className="section__label">ACCOUNT</p>
        <h2 className="section__title">마음 전하실 곳</h2>
        <p className="section__desc">
          참석이 어려우신 분들을 위해 기재했습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
        <div className="accounts">
          <Group title="신랑측 계좌번호" accounts={wedding.accounts.groom} onCopy={onCopy} />
          <Group title="신부측 계좌번호" accounts={wedding.accounts.bride} onCopy={onCopy} />
        </div>
      </Reveal>
      <Toast message={message} />
    </section>
  );
}
