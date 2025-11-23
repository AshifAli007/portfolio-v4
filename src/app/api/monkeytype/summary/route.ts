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

    const lastBody = (await lastRes.json()) as unknown;
    const profileBody = (await profileRes.json()) as unknown;
    const toRecord = (val: unknown): Record<string, unknown> | null =>
      val && typeof val === "object" ? (val as Record<string, unknown>) : null;

    const lastRecord = toRecord(lastBody);
    const last = toRecord(lastRecord?.data) ?? lastRecord ?? {};

    const profileRecord = toRecord(profileBody);
    const source = toRecord(profileRecord?.data) ?? profileRecord ?? {};
    const stats = toRecord(source?.stats) ?? toRecord(source?.data) ?? source;
    const alltime = toRecord(stats?.alltime) ?? null;
    const streakObj = toRecord(stats?.streak) ?? null;
    const settingsObj = toRecord(stats?.settings) ?? null;
    const statsLast = toRecord(stats?.last) ?? null;

    const normalizeTimestamp = (ts: unknown): string => {
      if (!ts && ts !== 0) return mockSummary.timestamp;
      const num = Number(ts);
      if (Number.isNaN(num)) return mockSummary.timestamp;
      const ms = num > 1_000_000_000_000 ? num : num * 1000;
      return new Date(ms).toISOString();
    };

    const mapped: MonkeytypeSummary = {
      wpm: (last.wpm as number) ?? (last.speed as number) ?? mockSummary.wpm,
      accuracy: (last.acc as number) ?? (last.accuracy as number) ?? mockSummary.accuracy,
      totalWords:
        (source?.totalWords as number) ??
        (stats?.totalWords as number) ??
        (stats?.typed as number) ??
        (stats?.words as number) ??
        (alltime?.words as number) ??
        mockSummary.totalWords,
      testsCompleted:
        (source?.testsCompleted as number) ??
        (stats?.testsCompleted as number) ??
        (stats?.tests as number) ??
        (alltime?.tests as number) ??
        mockSummary.testsCompleted,
      currentStreak:
        (source?.currentStreak as number) ??
        (stats?.currentStreak as number) ??
        (stats?.streak as number) ??
        (streakObj?.current as number) ??
        mockSummary.currentStreak,
      keyboard:
        (source?.keyboard as string) ??
        (stats?.keyboard as string) ??
        (settingsObj?.keyboard as string) ??
        mockSummary.keyboard,
      mode: last.mode ? `${last.mode as string} ${(last.mode2 as string) ?? ""}`.trim() : mockSummary.mode,
      language: (last.language as string) ?? mockSummary.language,
      timestamp: normalizeTimestamp(
        (last.timestamp as unknown) ?? (last.time as unknown) ?? (statsLast?.timestamp as unknown) ?? (statsLast?.time as unknown),
      ),
      raw: { last, profile: source },
    };
    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Monkeytype summary", error);
    return NextResponse.json(mockSummary, { status: 200 });
  }
}
