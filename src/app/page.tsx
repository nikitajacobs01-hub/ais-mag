import HeroText from "../components/HeroText";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#021024] flex flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <HeroText text="Advanced Intelligence System" />
      </main>
    </div>
  );
}
