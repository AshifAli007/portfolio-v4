import assert from "node:assert";
import { mockTopTracks } from "@/lib/spotify/routes";

const tracks = mockTopTracks();
assert(tracks.length > 0);
