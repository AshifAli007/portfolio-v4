
// If headerData is a simple exported object, you can import it server-side:
// import { headerData } from "@/data/headerData";


import Navbar from "@/components/Navbar";
import Galaxy from "@/components/Galaxy/index";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contacts from "@/components/Contacts";
import Recommendations from "@/components/Recommendation";
import RecentActivitiesPreview from "@/components/Sports/RecentActivitiesPreview";
import SpotifyOverview from "@/components/Spotify/SpotifyOverview";
import MonkeytypeSummary from "@/components/Monkeytype/MonkeytypeSummary";
import BuyMeCoffee from "@/components/Support/BuyMeCoffee";

// --- Static metadata (replaces react-helmet) ---
// export const metadata: Metadata = {
//   title: `${headerData?.name ?? "Portfolio"} - Portfolio`,
// };


export default function Home() {
    const theme = {
        primary: "#89d3ce",
        secondary: "#000000",
        tertiary: "#ffffff",
        tertiary80: "rgba(255,255,255,0.80)",
        primary30: "rgba(137,211,206,0.30)",
        primary50: "rgba(137,211,206,0.50)",
    };
    return (
        <div>
            <Navbar />
            <Galaxy />
            <About />

            <div className="section-lazy">
                <Experience colors={theme} />
            </div>
            <div className="section-lazy">
                <Education />
            </div>
            <div className="section-lazy">
                <Skills />
            </div>
            <div className="section-lazy">
                <Projects colors={theme} />
            </div>
            <div className="section-lazy">
                <Recommendations />
            </div>
            <div className="section-lazy">
                <RecentActivitiesPreview />
            </div>
            <div className="section-lazy">
                <SpotifyOverview />
            </div>
            <section className="section-lazy mt-12 px-4 md:px-8">
                <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.9fr)]">
                    <MonkeytypeSummary className="mt-0" fullWidth />
                    <BuyMeCoffee colors={theme} />
                </div>
            </section>
            <div className="section-lazy">
                <Contacts colors={theme} />
            </div>
        </div>
    );
}
