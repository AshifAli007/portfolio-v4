import { NextResponse } from "next/server";

type MonkeytypeSummary = {
  wpm: number;
  accuracy: number;
  totalWords: number;
  testsCompleted: number;
  currentStreak: number;
  keyboard: string;
  mode: string;
  language: string;
  timestamp: string;
  raw?: unknown;
};

const mockSummary: MonkeytypeSummary = {
  wpm: 82,
  accuracy: 97,
  totalWords: 872,
  testsCompleted: 42,
  currentStreak: 5,
  keyboard: "Keychron K-series",
  mode: "time 60",
  language: "english",
  timestamp: new Date().toISOString(),
};

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.MONKEYTYPE_API_KEY ?? process.env.MONKEYTYPE_APE_KEY;
  if (!apiKey) {
    return NextResponse.json(mockSummary, { status: 200 });
  }

  try {
    const headers = { Authorization: `ApeKey ${apiKey}` };

    const [lastRes, profileRes] = await Promise.all([
      fetch("https://api.monkeytype.com/results/last", { headers }),
      fetch("https://api.monkeytype.com/users/current", { headers }),
    ]);

    if (!lastRes.ok) throw new Error(`Monkeytype last request failed: ${lastRes.status}`);
    if (!profileRes.ok) throw new Error(`Monkeytype profile request failed: ${profileRes.status}`);

    const lastBody = (await lastRes.json()) as any;
    const profileBody = (await profileRes.json()) as any;
    const last = lastBody?.data ?? lastBody ?? {};
    const source = profileBody?.data ?? profileBody ?? {};
    const stats = source.stats ?? source.data ?? source;

    const normalizeTimestamp = (ts: any): string => {
      if (!ts && ts !== 0) return mockSummary.timestamp;
      const num = Number(ts);
      if (Number.isNaN(num)) return mockSummary.timestamp;
      const ms = num > 1_000_000_000_000 ? num : num * 1000;
      return new Date(ms).toISOString();
    };

    const mapped: MonkeytypeSummary = {
      wpm: last.wpm ?? last.speed ?? mockSummary.wpm,
      accuracy: last.acc ?? last.accuracy ?? mockSummary.accuracy,
      totalWords:
        source.totalWords ??
        stats?.totalWords ??
        stats?.typed ??
        stats?.words ??
        stats?.alltime?.words ??
        mockSummary.totalWords,
      testsCompleted:
        source.testsCompleted ??
        stats?.testsCompleted ??
        stats?.tests ??
        stats?.alltime?.tests ??
        mockSummary.testsCompleted,
      currentStreak:
        source.currentStreak ??
        stats?.currentStreak ??
        stats?.streak ??
        stats?.streak?.current ??
        mockSummary.currentStreak,
      keyboard: source.keyboard ?? stats?.keyboard ?? stats?.settings?.keyboard ?? mockSummary.keyboard,
      mode: last.mode ? `${last.mode} ${last.mode2 ?? ""}`.trim() : mockSummary.mode,
      language: last.language ?? mockSummary.language,
      timestamp: normalizeTimestamp(last.timestamp ?? last.time ?? stats?.last?.timestamp),
      raw: { last, profile: source },
    };
    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Monkeytype summary", error);
    return NextResponse.json(mockSummary, { status: 200 });
  }
}
