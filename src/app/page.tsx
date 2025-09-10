import Footer from "@/components/Layouts/Footer";
import LandingPage from "./landing";
import GlowCursor from "./MouseVars";

export default function Home() {
  return (
    <>
      {/* <GlowCursor radius={600} colorRGB="29, 78, 216" alpha={0.15} falloff="80%" /> */}
      <LandingPage />
      <Footer />
    </>
  );
}
