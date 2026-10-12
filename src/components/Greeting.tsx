import { wedding } from "@/data/wedding";
import Reveal from "./Reveal";

export default function Greeting() {
  const { greeting } = wedding;
  return (
    <section className="section">
      <Reveal>
        <p className="section__label">INVITATION</p>
        <h2 className="section__title">{greeting.title}</h2>
        <p className="greeting__body">
          {greeting.body.map((line, i) => (line ? <span key={i}>{line}<br /></span> : <br key={i} />))}
        </p>
      </Reveal>
    </section>
  );
}
