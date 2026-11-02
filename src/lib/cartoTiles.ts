const CARTO_API_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;

export const cartoTiles =
  (style: "dark_all" | "dark_nolabels") =>
  (x: number, y: number, z: number, dpr?: number) =>
    `https://basemaps.cartocdn.com/rastertiles/${style}/${z}/${x}/${y}${
      dpr && dpr >= 2 ? "@2x" : ""
    }.png?key=${CARTO_API_KEY}`;
