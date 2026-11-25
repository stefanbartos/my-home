/**
 * The src of an openstreetmap.org embed centred on a point, with a marker on it.
 * OSM embeds take a bounding box, not a zoom level, so `zoom` (as on
 * openstreetmap.org, 0–19) is turned into a box about as wide as a 600 px map.
 */
export function osmEmbedUrl(lat: number, lon: number, zoom: number) {
    if (Math.abs(lat) > 85 || Math.abs(lon) > 180) {
        throw new RangeError(`Invalid coordinates: ${lat}, ${lon}`);
    }
    if (!Number.isInteger(zoom) || zoom < 0 || zoom > 19) {
        throw new RangeError(`Invalid zoom: ${zoom}`);
    }
    // A 256 px tile spans 360 / 2^zoom degrees of longitude.
    const halfWidth = ((600 / 256) * (360 / 2 ** zoom)) / 2;
    // 4:3 map, and a degree of latitude is longer than one of longitude by 1 / cos(lat).
    const halfHeight = halfWidth * 0.75 * Math.cos((lat * Math.PI) / 180);
    const bbox = [lon - halfWidth, lat - halfHeight, lon + halfWidth, lat + halfHeight]
        .map((n) => n.toFixed(5))
        .join(",");
    const params = new URLSearchParams({ bbox, layer: "mapnik", marker: `${lat},${lon}` });
    return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

/** A link to the same place on openstreetmap.org, with a marker. */
export function osmMapUrl(lat: number, lon: number, zoom: number) {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}
