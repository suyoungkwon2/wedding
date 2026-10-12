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

function Row({ person, role }: { person: Person; role: string }) {
  return (
    <p className="couple__row">
      <span className="couple__parents">
        <Parent name={person.father} deceased={person.fatherDeceased} />
        <span className="couple__dot">·</span>
        <Parent name={person.mother} deceased={person.motherDeceased} />
      </span>
      <span className="couple__relation">의 {person.relation}</span>
      <span className="couple__role">{role}</span>
      <strong className="couple__name">{person.name}</strong>
    </p>
  );
}

export default function Couple() {
  return (
    <section className="section section--tight">
      <Reveal>
        <Row person={wedding.groom} role="신랑" />
        <Row person={wedding.bride} role="신부" />
      </Reveal>
    </section>
  );
}
