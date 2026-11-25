/** A track point as [latitude, longitude] in degrees. */
export type LatLon = [number, number];

const POINT = /<(?:trkpt|rtept)\b[^>]*>/gu;
const LAT = /\blat\s*=\s*["']([^"']+)["']/u;
const LON = /\blon\s*=\s*["']([^"']+)["']/u;

/**
 * Track and route points of a GPX file, in file order. Waypoints (`<wpt>`)
 * are skipped. Throws when the file has no points or a point is malformed.
 */
export function parseGpxTrack(xml: string): LatLon[] {
    const points = (xml.match(POINT) ?? []).map((tag): LatLon => {
        const lat = Number(LAT.exec(tag)?.[1]);
        const lon = Number(LON.exec(tag)?.[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            throw new TypeError(`Invalid GPX point: ${tag}`);
        }
        return [lat, lon];
    });
    if (points.length === 0) {
        throw new Error("GPX has no track or route points");
    }
    return points;
}

/** Distance of `p` from the segment `a`–`b`, in degrees (fine for short segments). */
function segmentDistance(p: LatLon, a: LatLon, b: LatLon) {
    const [px, py] = p;
    const [ax, ay] = a;
    const dx = b[0] - ax;
    const dy = b[1] - ay;
    const lengthSquared = dx * dx + dy * dy;
    const t =
        lengthSquared === 0
            ? 0
            : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/**
 * Drops points that deviate less than `tolerance` degrees from the simplified
 * line (Douglas–Peucker) and rounds coordinates to 5 decimals (about 1 m).
 * The first and last points are always kept.
 */
export function simplifyTrack(points: LatLon[], tolerance: number): LatLon[] {
    if (points.length <= 2) {
        return points.map((point) => round(point));
    }
    const keep = Array.from({ length: points.length }, () => false);
    keep[0] = true;
    keep[points.length - 1] = true;
    const stack: [number, number][] = [[0, points.length - 1]];
    for (let range = stack.pop(); range; range = stack.pop()) {
        const [first, last] = range;
        let maxDistance = 0;
        let index = first;
        for (let i = first + 1; i < last; i++) {
            const distance = segmentDistance(points[i], points[first], points[last]);
            if (distance > maxDistance) {
                maxDistance = distance;
                index = i;
            }
        }
        if (maxDistance > tolerance) {
            keep[index] = true;
            stack.push([first, index], [index, last]);
        }
    }
    return points.filter((_, i) => keep[i]).map((point) => round(point));
}

function round([lat, lon]: LatLon): LatLon {
    return [Math.round(lat * 1e5) / 1e5, Math.round(lon * 1e5) / 1e5];
}
