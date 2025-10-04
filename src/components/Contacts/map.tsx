"use client";

import { Map, Marker, Overlay, GeoJsonLoader } from "pigeon-maps";
import { useState } from "react";


type Props = { height?: number; className?: string };

export default function FooterMapLite({ height = 260, className = "" }: Props) {
  const FIXED_CENTER: [number, number] = [30.447463, -84.309007]; // [lat, lng]
  const [center] = useState<[number, number]>(FIXED_CENTER);
    const geoJsonLink = "https://raw.githubusercontent.com/danielcs88/fl_geo_json/refs/heads/master/geojson-fl-counties-fips.json"


  const provider = (x: number, y: number, z: number, dpr?: number) =>
    `https://cartodb-basemaps-${"abcd"[x % 4]}.global.ssl.fastly.net/dark_all/${z}/${x}/${y}${
      dpr && dpr >= 2 ? "@2x" : ""
    }.png`;

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
        // provider={provider}
        animate
        // metaWheelZoom={true}
        defaultWidth={600}
        dprs={[1, 2]}
        defaultCenter={center}
        
      >
        <GeoJsonLoader
        link={"geojson-fl.json"}
        styleCallback={(feature, hover) =>
          hover
            ? { fill: 'rgba(0, 160, 175, 0.73)', strokeWidth: '2', stroke: '#ffffffcb' }
            : { fill: 'rgba(137, 211, 206, 0.5)', strokeWidth: '1', stroke: '#0998c353' }
        }
      />
        <Marker width={36} anchor={center} />
        <Overlay anchor={center} offset={[20, -3]}>
          <div className="px-2 py-1 rounded bg-black/60 text-white text-xs font-medium shadow">
            Tallahassee, FL
          </div>
        </Overlay>
      </Map>
    </div>
  );
}