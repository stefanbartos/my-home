import { describe, expect, test } from "vitest";
import { osmEmbedUrl, osmMapUrl } from "./osm";

/** The bbox of an embed URL as [west, south, east, north]. */
function bbox(url: string) {
    return (new URL(url).searchParams.get("bbox") as string).split(",").map(Number);
}

describe("osmEmbedUrl", () => {
    test("builds an embed URL with a box centred on the marker", () => {
        const url = new URL(osmEmbedUrl(49.17521, 18.86829, 14));
        expect(url.origin + url.pathname).toBe("https://www.openstreetmap.org/export/embed.html");
        expect(url.searchParams.get("layer")).toBe("mapnik");
        expect(url.searchParams.get("marker")).toBe("49.17521,18.86829");
        const [west, south, east, north] = bbox(url.href);
        expect((west + east) / 2).toBeCloseTo(18.86829, 4);
        expect((south + north) / 2).toBeCloseTo(49.17521, 4);
        expect(east - west).toBeCloseTo(0.0515, 3);
        expect(north - south).toBeLessThan(east - west);
    });

    test("halves the box with every zoom level", () => {
        const [west10, , east10] = bbox(osmEmbedUrl(0, 0, 10));
        const [west11, , east11] = bbox(osmEmbedUrl(0, 0, 11));
        expect((east10 - west10) / (east11 - west11)).toBeCloseTo(2, 2);
    });

    test("throws a RangeError for invalid coordinates or zoom", () => {
        expect(() => osmEmbedUrl(91, 0, 10)).toThrow(RangeError);
        expect(() => osmEmbedUrl(0, 181, 10)).toThrow(RangeError);
        expect(() => osmEmbedUrl(0, 0, 20)).toThrow("Invalid zoom: 20");
        expect(() => osmEmbedUrl(0, 0, 1.5)).toThrow(RangeError);
    });
});

describe("osmMapUrl", () => {
    test("links to the point with a marker", () => {
        expect(osmMapUrl(49.17521, 18.86829, 14)).toBe(
            "https://www.openstreetmap.org/?mlat=49.17521&mlon=18.86829#map=14/49.17521/18.86829",
        );
    });
});
