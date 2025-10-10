"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Map, GeoJson } from "pigeon-maps";

import { useStravaOverview } from "@/hooks/useStravaOverview";
import type { NormalizedActivity } from "@/lib/strava/types";

const KM_TO_MILES = 0.621371;
const KM_PER_MILE = 1 / KM_TO_MILES;
const METERS_TO_FEET = 3.28084;

const accentColor = "#89d3ce";
const stravaOrange = "#FC4C02";

const formatDistance = (distanceKm: number | undefined): string => {
  if (!distanceKm || distanceKm <= 0) return "—";
  return `${(distanceKm * KM_TO_MILES).toFixed(1)} mi`;
};

const formatElevation = (elevationM: number | undefined): string => {
  if (elevationM === undefined || elevationM === null) return "—";
  return `${Math.round(elevationM * METERS_TO_FEET)} ft`;
};

const formatDuration = (seconds: number | undefined): string => {
  if (!seconds || seconds <= 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatPace = (activity: NormalizedActivity): string | null => {
  if (activity.sportType !== "Run" || !activity.averagePaceSecPerKm) return null;
  const secondsPerMile = activity.averagePaceSecPerKm * KM_PER_MILE;
  const paceMinutes = Math.floor(secondsPerMile / 60);
  const paceSeconds = Math.round(secondsPerMile % 60)
    .toString()
    .padStart(2, "0");
  return `${paceMinutes}:${paceSeconds} /mi`;
};

const ActivitySkeleton = () => (
  <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur">
    <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
    <div className="mt-4 grid grid-cols-3 gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  </div>
);

const decodePolyline = (encoded: string): Array<[number, number]> => {
  let index = 0;
  const coordinates: Array<[number, number]> = [];
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index) - 63;
      index += 1;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index) - 63;
      index += 1;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
};

const darkProvider = (x: number, y: number, z: number, dpr?: number) =>
  `https://cartodb-basemaps-${"abcd"[x % 4]}.global.ssl.fastly.net/dark_nolabels/${z}/${x}/${y}${dpr && dpr >= 2 ? "@2x" : ""}.png`;

const ActivityRouteMap = ({ polyline }: { polyline?: string | null }) => {
  if (!polyline) {
    return (
      <div className="flex h-36 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.25rem] text-slate-400">
        Route pending
      </div>
    );
  }

  const points = decodePolyline(polyline);
  if (!points.length) {
    return (
      <div className="flex h-36 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.25rem] text-slate-400">
        Route unavailable
      </div>
    );
  }

  const lats = points.map(([lat]) => lat);
  const lngs = points.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const paddingLat = Math.max((maxLat - minLat) * 0.1, 0.001);
  const paddingLng = Math.max((maxLng - minLng) * 0.1, 0.001);
  const bounds: [[number, number], [number, number]] = [
    [minLat - paddingLat, minLng - paddingLng],
    [maxLat + paddingLat, maxLng + paddingLng],
  ];

  const center: [number, number] = [
    (minLat + maxLat) / 2,
    (minLng + maxLng) / 2,
  ];

  const geoJson = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates: points.map(([lat, lng]) => [lng, lat]),
        },
      },
    ],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 mb-3">
      <Map
        height={150}
        defaultCenter={center}
        // bounds={bounds}
        mouseEvents={true}
        touchEvents={true}
        attribution={false}
        provider={darkProvider}
      >
        <GeoJson
          data={geoJson}
          svgAttributes={{
            strokeWidth: 3,
            stroke: stravaOrange,
            fill: "none",
            opacity: 0.85,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </Map>
    </div>
  );
};

export default function RecentActivitiesPreview() {
  const { data, loading, error } = useStravaOverview();

  const activities = useMemo(
    () => data?.recentActivities.slice(0, 3) ?? [],
    [data?.recentActivities],
  );

  if (loading) {
    return (
      <section
        aria-label="Recent Strava activities"
        className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6"
      >
        <ActivitySkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">
            Unable to load Strava activities right now. Head over to the sports page for the full
            dashboard or retry later.
          </p>
        </div>
      </section>
    );
  }

  if (!activities.length) {
    return null;
  }

  return (
    <section
      aria-label="Recent Strava activities"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6"
    >
      <div
        className="rounded-3xl border border-white/5 bg-glow-section p-8 shadow-xl backdrop-blur"
        style={{ ["--section-bg" as string]: "rgba(8,8,8,0.7)" }}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: accentColor }}>
              Latest Activities
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Snapshot from my Strava pulling in the latest sessions I did.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sports"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
            >
              Explore Sports
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {activities.map((activity) => {
            const pace = formatPace(activity);
            return (
              <article
                key={activity.id}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.015] p-5 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.05]"
              >
                <ActivityRouteMap polyline={activity.mapPolyline} />

                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25rem] text-slate-400">
                  <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                  <span>{activity.sportType}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{activity.name}</h3>

                <dl className="mt-4 space-y-2 text-sm text-slate-200">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-slate-400">Distance</dt>
                    <dd className="font-medium">{formatDistance(activity.distanceKm)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-slate-400">Moving Time</dt>
                    <dd className="font-medium">{formatDuration(activity.movingTimeSec)}</dd>
                  </div>

                  {pace && (
                    <div className="flex items-baseline justify-between">
                      <dt className="text-slate-400">Avg Pace</dt>
                      <dd className="font-medium">{pace}</dd>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between">
                    <dt className="text-slate-400">Elevation</dt>
                    <dd className="font-medium">{Math.round(activity.elevationGainM)} m</dd>
                  </div>
                </dl>

                <a
                  href={activity.externalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition"
                  style={{ color: stravaOrange }}
                >
                  View on Strava
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                </a>
                {activity.isRace && (
                  <span
                    className="absolute right-5 top-5 rounded-full border border-transparent px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3rem]"
                    style={{
                      backgroundColor: "rgba(252,76,2,0.12)",
                      color: stravaOrange,
                    }}
                  >
                    Race
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
