import Hero from "@/components/Hero";
import Greeting from "@/components/Greeting";
import Couple from "@/components/Couple";
import DateSection from "@/components/DateSection";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Accounts from "@/components/Accounts";
import Notices from "@/components/Notices";
import Polaroids from "@/components/Polaroids";
import BgmPlayer from "@/components/BgmPlayer";
import { wedding } from "@/data/wedding";

export default function Home() {
  return (
    <main className="page">
      <BgmPlayer />
      <Hero />
      <Greeting />
      <Couple />
      <DateSection />
      <Gallery />
      <Location />
      <Accounts />
      <Polaroids />
      <Notices />
      <footer className="footer">
        {wedding.groom.nameEn} &amp; {wedding.bride.nameEn}
      </footer>
    </main>
  );
}
