import { wedding, type Person } from "@/data/wedding";
import Reveal from "./Reveal";

function Parent({ name, deceased }: { name: string; deceased?: boolean }) {
  return (
    <span className={deceased ? "couple__deceased" : undefined}>
      {deceased && "故 "}
      {name}
    </span>
  );
}

function Family({ label, person }: { label: string; person: Person }) {
  return (
    <div className="couple__family">
      <p className="couple__label">{label}</p>
      <p className="couple__line">
        <Parent name={person.father} deceased={person.fatherDeceased} />
        <span className="couple__dot">·</span>
        <Parent name={person.mother} deceased={person.motherDeceased} />의 {person.relation} {person.name}
      </p>
    </div>
  );
}

export default function Couple() {
  return (
    <section className="section section--tight">
      <Reveal>
        <Family label="신랑측 혼주" person={wedding.groom} />
        <Family label="신부측 혼주" person={wedding.bride} />
      </Reveal>
    </section>
  );
}
