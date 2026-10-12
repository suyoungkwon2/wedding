import { wedding } from "@/data/wedding";
import Reveal from "./Reveal";

export default function Notices() {
  return (
    <section className="section">
      <Reveal>
        <p className="section__label">INFORMATION</p>
        <h2 className="section__title">안내사항</h2>
        <ul className="notices">
          {wedding.notices.map((n) => (
            <li key={n.title} className="notices__item">
              <h3 className="notices__title">{n.title}</h3>
              <p className="notices__body">{n.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
