import Navbar from "@/components/Navbar";
import ParabolaDemo from "@/components/Math/ParabolaDemo";

export default function MathPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 pt-30 md:px-6">
        <header className="mb-10 space-y-2">
          <p className="text-sm uppercase tracking-wide text-[#89d3ce]">Learning log</p>
          <h1 className="text-3xl font-semibold text-white">Math</h1>
          <p className="max-w-2xl text-slate-300">
            Equations, sketches, and small interactive demos from topics I am studying. This section
            grows over time—add more routes under <code className="text-[#89d3ce]">/math/…</code> as
            you go.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-lg font-medium text-white">Quadratic preview</h2>
          <ParabolaDemo />
        </section>
      </main>
    </>
  );
}
