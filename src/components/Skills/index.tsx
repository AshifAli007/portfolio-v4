// components/Skills.tsx
"use client";

import Image from "next/image";

/* ---------------- types ---------------- */

type IconSpec = {
  src: string;
  alt: string;
  variant?: "adobe" | "wide" | "plain";
};

type DevItem = { name: string; href: string; icon: string };



/* ---------------- data ---------------- */

const DEV_ITEMS: DevItem[] = [
  { name: "React", href: "https://react.dev", icon: "/svg/skills/dev/React.svg" },
  { name: "TypeScript", href: "https://www.typescriptlang.org", icon: "/svg/skills/dev/TypeScript.svg" },
  { name: "JavaScript", href: "https://developer.mozilla.org/docs/Web/JavaScript", icon: "/svg/skills/dev/JavaScript.svg" },
  { name: "Node.js", href: "https://nodejs.org", icon: "/svg/skills/dev/Node.js.svg" },
  { name: "HTML5", href: "https://developer.mozilla.org/docs/Web/HTML", icon: "/svg/skills/dev/HTML5.svg" },
  { name: "CSS3", href: "https://developer.mozilla.org/docs/Web/CSS", icon: "/svg/skills/dev/CSS3.svg" },
  { name: "Angular", href: "https://angular.dev", icon: "/svg/skills/dev/Angular.svg" },
  { name: "Python", href: "https://www.python.org", icon: "/svg/skills/dev/Python.svg" },
  { name: "AWS", href: "https://aws.amazon.com", icon: "/svg/skills/dev/AWS.svg" },
  { name: "Git", href: "https://git-scm.com", icon: "/svg/skills/dev/Git.svg" },
  { name: "MongoDB", href: "https://www.mongodb.com", icon: "/svg/skills/dev/MongoDB.svg" },
  { name: "PostgreSQL", href: "https://www.postgresql.org", icon: "/svg/skills/dev/PostgresSQL.svg" },
  { name: "Jupyter", href: "https://jupyter.org", icon: "/svg/skills/dev/Jupyter.svg" },
  { name: "C++", href: "https://isocpp.org", icon: "/svg/skills/dev/C%2B%2B%20(CPlusPlus).svg" },
];

const AWS_ICONS: IconSpec[] = [
  { src: "/svg/skills/aws/Glue.svg", alt: "AWS Glue", variant: "plain" },
  { src: "/svg/skills/aws/SimpleStorageService.svg", alt: "Amazon S3 (Simple Storage Service)", variant: "plain" },
  { src: "/svg/skills/aws/APIGateway.svg", alt: "Amazon API Gateway", variant: "plain" },
  { src: "/svg/skills/aws/AppFlow.svg", alt: "Amazon AppFlow", variant: "plain" },
  { src: "/svg/skills/aws/Athena.svg", alt: "Amazon Athena", variant: "plain" },
  { src: "/svg/skills/aws/CloudFormation.svg", alt: "AWS CloudFormation", variant: "plain" },
  { src: "/svg/skills/aws/CloudWatch.svg", alt: "Amazon CloudWatch", variant: "plain" },
  { src: "/svg/skills/aws/CodeWhisperer.svg", alt: "Amazon Code Whisperer", variant: "plain" },
  { src: "/svg/skills/aws/DynamoDB.svg", alt: "Amazon DynamoDB", variant: "plain" },
  { src: "/svg/skills/aws/EC2.svg", alt: "Amazon EC2", variant: "plain" },
  { src: "/svg/skills/aws/EventBridge.svg", alt: "Amazon EventBridge", variant: "plain" },
  { src: "/svg/skills/aws/IAMIdentityCenter.svg", alt: "AWS IAM", variant: "plain" },
  { src: "/svg/skills/aws/KinesisFirehose.svg", alt: "Amazon Kinesis Data Firehose", variant: "plain" },
  { src: "/svg/skills/aws/Lambda.svg", alt: "AWS Lambda", variant: "plain" },
  { src: "/svg/skills/aws/StepFunctions.svg", alt: "AWS Step Functions", variant: "plain" },
];

const TOOLS = ["Git + GitHub", "Command Line", "Chrome DevTools", "Jest", "Postman"];
const KNOWLEDGE = ["Micro-frontend", "Microservices", "Algorithms", "Problem-solving", "Large-Scale Projects"];

/* ---------------- small helpers ---------------- */

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
  </svg>
);



// --- NEW: deterministic pattern + rows for DEVELOPMENT ---
type DevRow = { items: DevItem[]; indent: number };

/** tiny seeded RNG so SSR/CSR stay in sync (no hydration mismatch) */
const seeded = (seed = 20250910) => {
  let t = seed >>> 0;
  return () => ((t = (t * 1664525 + 1013904223) >>> 0) / 2 ** 32);
};

/** split into rows of 2 or 3, avoiding a leftover of 1; also assign an indent per row */
const buildDevRows = (items: DevItem[]): DevRow[] => {
  const rnd = seeded(197);
  const rows: DevRow[] = [];
  let i = 0;
  let remaining = items.length;

  // choose a sizes pattern like [3,2,3,2,...] but with deterministic randomness
  const sizes: number[] = [];
  while (remaining > 0) {
    let take = rnd() < 0.5 ? 2 : 3;
    // avoid leaving a remainder of 1
    if (remaining - take === 1) take = remaining >= 3 ? 3 : 2;
    if (take > remaining) take = remaining;
    sizes.push(take);
    remaining -= take;
  }

  // build rows and assign a small left indent (in px)
  for (const take of sizes) {
    const rowItems = items.slice(i, i + take);
    i += take;
    const indentPx = Math.round(rnd() * 28); // 0..28px
    rows.push({ items: rowItems, indent: indentPx });
  }
  return rows;
};

// precompute once so order/indents are stable
const DEV_ROWS: DevRow[] = buildDevRows(DEV_ITEMS);

// Neat label generator from alt text (drops 'AWS/Amazon' + parentheses)
// Shorten labels (drops "AWS"/"Amazon" + any parentheses)
const prettyAwsName = (alt: string) => {
  let name = alt.replace(/\s*\(.*?\)\s*/g, "").trim();
  name = name.replace(/^(AWS|Amazon)\s+/i, "");
  name = name.replace(/^Kinesis Data\s+/i, "Kinesis ");
  return name;
};

export default function Skills() {
  return (
    <section aria-labelledby="skills-title" className="w-full bg-transparent text-sm px-20 mb-50">
      {/* Title */}
      <div className="mb-15">
        <h2
          className="self-start mb-[1.2rem]
                       text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] lg:text-[1.6rem]
                       font-semibold tracking-tight
                       "
          style={{ color: "#89d3ce" }}
        >
          Skills
        </h2>

      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* DEVELOPMENT */}
        <div className="col-span-12 lg:col-span-6">
          <Header iconSrc="/svg/skills/dev/dev.svg" title="DEVELOPMENT" />

          {/* scattered clickable pills */}
          {/* compact rows with consistent horizontal spacing; first pill per row gets a variable indent */}
          <div className="mt-4 flex flex-col gap-1.5 sm:gap-2">
            {DEV_ROWS.map((row, ri) => (
              <div
                key={ri}
                className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3"
                style={{ marginLeft: row.indent }}
              >
                {row.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.name}
                    className={[
                      "group inline-flex items-center gap-2 rounded-xl w-fit",
                      "border border-white/10 px-3 py-1.5 text-xs leading-none",
                      "bg-transparent cursor-pointer transition",
                      "hover:border-cyan-400/60 hover:shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40",
                    ].join(" ")}
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="opacity-80 group-hover:opacity-100"
                    />
                    <span className="opacity-90">{item.name}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: AWS / TOOLS / KNOWLEDGE */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AWS */}
          {/* AWS */}
          <div className="md:col-span-2">
            <Header iconSrc="/svg/skills/dev/aws.svg" title="AWS" />

            {/* Equal-width tiles, equal gaps, labels wrap to 2 lines max */}
            <div className="mt-4 grid [grid-template-columns:repeat(auto-fill,minmax(66px,1fr))] gap-0.5">
              {AWS_ICONS.map((ic) => (
                <div key={ic.alt} className="flex flex-col items-center gap-1 w-[66px] mx-auto">
                  <DesignIcon spec={ic} />
                  <span
                    className="text-[10px] sm:text-[11px] leading-tight text-center opacity-80 break-words"
                    title={prettyAwsName(ic.alt)}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,      // clamp to 2 lines
                      overflow: "hidden",      // hide overflow for equal heights
                      minHeight: "1.6em",      // ensures single-line labels align nicely
                    }}
                  >
                    {prettyAwsName(ic.alt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOOLS */}
          <div>
            <Header iconSrc="/svg/skills/dev/tools.svg" title="TOOLS" />
            <ul className="mt-4 space-y-2 text-sm">
              {TOOLS.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 opacity-80" />
                  <span className="opacity-90">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KNOWLEDGE */}
          <div>
            <Header iconSrc="/svg/skills/dev/network.svg" title="KNOWLEDGE" />
            <ul className="mt-4 space-y-2 text-sm">
              {KNOWLEDGE.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 opacity-80" />
                  <span className="opacity-90">{k}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- helpers ---------------- */

function Header({ iconSrc, title }: { iconSrc: string; title: string }) {
  return (
    <div className="flex items-center gap-2 ml-1">
      <Image src={iconSrc} alt="" width={20} height={20} className="opacity-90" priority />
      <h3 className="text-[0.78rem] tracking-[0.18em] font-extrabold">{title}</h3>
    </div>
  );
}

function DesignIcon({ spec }: { spec: IconSpec }) {
  const common = "relative inline-flex items-center justify-center";

  if (spec.variant === "adobe") {
    return (
      <span className={`${common} h-10 w-10 rounded-sm border border-white/20`}>
        <Image src={spec.src} alt={spec.alt} width={22} height={22} />
      </span>
    );
  }

  if (spec.variant === "wide") {
    return (
      <span className={`${common} h-8`}>
        <Image src={spec.src} alt={spec.alt} width={72} height={20} />
      </span>
    );
  }

  return (
    <span className={`${common} h-10 w-10`}>
      <Image src={spec.src} alt={spec.alt} width={28} height={28} />
    </span>
  );
}