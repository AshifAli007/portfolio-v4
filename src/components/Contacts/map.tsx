"use client";

import { Map, Marker, Overlay, GeoJsonLoader } from "pigeon-maps";
import { useState } from "react";
import type { Feature } from "geojson";
import { cartoTiles } from "@/lib/cartoTiles";

const provider = cartoTiles("dark_all");

type Props = { height?: number; className?: string };

export default function FooterMapLite({ height = 260, className = "" }: Props) {
  const FIXED_CENTER: [number, number] = [42.3601, -71.0589]; // [lat, lng]
  const [center] = useState<[number, number]>(FIXED_CENTER);

  return (
    <div
      className={`w-full overflow-hidden relative ${className}`}
      style={{
        height,
        borderRadius: 12,
      }}
    >
      <Map
        center={center}
        zoom={6}
        provider={provider}
        animate
        // metaWheelZoom={true}
        defaultWidth={600}
        dprs={[1, 2]}
        defaultCenter={center}
        
      >
        <GeoJsonLoader
        link={"geojson-ma.json"}
        styleCallback={(_feature: Feature, hover: boolean) =>
          hover
            ? { fill: 'rgba(0, 160, 175, 0.73)', strokeWidth: '2', stroke: '#ffffffcb' }
            : { fill: 'rgba(137, 211, 206, 0.5)', strokeWidth: '1', stroke: '#0998c353' }
        }
      />
        <Marker width={36} anchor={center} />
        <Overlay anchor={center} offset={[20, -3]}>
          <div className="px-2 py-1 rounded bg-black/60 text-white text-xs font-medium shadow">
            Boston, MA
          </div>
        </Overlay>
      </Map>
    </div>
  );
}