
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
            {/* <PreLoader /> */}
            <Navbar />
            <Galaxy />
            <About />
            <Education />
            <Skills colors={theme} />
            <Experience colors={theme} />
            <Projects colors={theme} />
            <Contacts colors={theme} />
            {/* <Galaxy />
        <About />
      <Education />
      <Skills />
      <Experience />
      <Projects />
      <Achievement />
      <Services />
      <Testimonials />
      <Blog />
      <Contacts /> */}
            {/* <Footer /> */}
        </div>
    );
}