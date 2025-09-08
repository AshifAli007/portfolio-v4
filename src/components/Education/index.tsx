import Education from "./components/Education";

export default function Home() {
  const theme = {
    // section + cards
    secondary: "#000000",
    primary: "#89d3ce",
    primary30: "rgba(137, 211, 206, 0.30)",
    primary50: "rgba(137, 211, 206, 0.50)",
    tertiary: "#ffffff",
    tertiary80: "rgba(255,255,255,0.80)",
    type: "dark" as const,
  };

  return (
    <>
      {/* ...other sections */}
      <Education colors={theme} />
    </>
  );
}