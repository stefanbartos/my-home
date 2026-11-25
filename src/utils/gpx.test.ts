import { describe, expect, test } from "vitest";
import type { LatLon } from "./gpx";
import { parseGpxTrack, simplifyTrack } from "./gpx";

const gpx = `<?xml version="1.0"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1">
  <wpt lat="1" lon="1"><name>Skipped</name></wpt>
  <trk><trkseg>
    <trkpt lat="49.175214" lon="18.868286"><ele>378</ele></trkpt>
    <trkpt lon='18.868412' lat='49.175120'/>
  </trkseg></trk>
  <rte><rtept lat="-1.5" lon="2.25"/></rte>
</gpx>`;

describe("parseGpxTrack", () => {
    test("returns track and route points in order, without waypoints", () => {
        expect(parseGpxTrack(gpx)).toStrictEqual([
            [49.175214, 18.868286],
            [49.17512, 18.868412],
            [-1.5, 2.25],
        ]);
    });

    test("throws when there are no points", () => {
        expect(() => parseGpxTrack("<gpx></gpx>")).toThrow("GPX has no track or route points");
    });

    test("throws for a malformed point", () => {
        expect(() => parseGpxTrack('<gpx><trkpt lat="x" lon="1"/></gpx>')).toThrow(
            "Invalid GPX point",
        );
    });
});

describe("simplifyTrack", () => {
    test("drops points close to a straight line and keeps both ends", () => {
        const line: LatLon[] = [
            [0, 0],
            [0.5, 0.00001],
            [1, 0],
        ];
        expect(simplifyTrack(line, 0.001)).toStrictEqual([
            [0, 0],
            [1, 0],
        ]);
    });

    test("keeps corners that deviate more than the tolerance", () => {
        const corner: LatLon[] = [
            [0, 0],
            [0.5, 0.5001],
            [1, 1],
            [1.5, 1],
            [2, 1],
        ];
        expect(simplifyTrack(corner, 0.01)).toStrictEqual([
            [0, 0],
            [1, 1],
            [2, 1],
        ]);
    });

    test("rounds coordinates to 5 decimals", () => {
        expect(simplifyTrack([[49.1752144, 18.8682866]], 0.001)).toStrictEqual([
            [49.17521, 18.86829],
        ]);
    });
});
