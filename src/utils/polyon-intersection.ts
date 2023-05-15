//A' ∩ B intersection
//https://qph.cf2.quoracdn.net/main-qimg-51cc903ca424eeecf5fe89b874419cab-lq
import { IPoint, IPolygon } from "../types";
import * as turf from "@turf/turf";
export const isPolygonIntersectsBulk = (aPolyongs: IPolygon[], b: IPolygon): boolean => {
  for (const aPolygon of aPolyongs) {
    const intersects = isPolygonsIntersect(aPolygon, b);

    if (intersects) {
      return true;
    }
  }
  return false;
};
export const isPolygonsIntersect = (polygonA: IPolygon, polygonB: IPolygon): boolean => {
  // Check if A within B
  const turfPolygonA = convertPolygonToTurfPolygon(polygonA);
  const turfPolygonB = convertPolygonToTurfPolygon(polygonB);
  if (turf.intersect(turfPolygonA, turfPolygonB)) {
    return true;
  }
  return false;
};

export const isAlmostIntersected = (polygonA: IPolygon, polygonB: IPolygon): boolean => {
  const ALMOST_INTERSECTED = 0.8;
  const turfPolygonA = convertPolygonToTurfPolygon(polygonA);
  const turfPolygonB = convertPolygonToTurfPolygon(polygonB);
  const intersection = turf.intersect(turfPolygonA, turfPolygonB);
  if (!intersection) {
    return false;
  }
  return ALMOST_INTERSECTED <= turf.area(intersection) / turf.area(turfPolygonA);
};

export const convertPolygonToTurfPolygon = (polygon: IPolygon) => {
  const points = polygon.points.map((point) => [point.x, point.y]);

  return turf.polygon([points.concat([points[0]])]);
};

// export const convertTurfPolygonToPolygon = (turfPolygon: Feature<Polygon, GeoJsonProperties>): IPolygon => {
//   return {
//     points: turfPolygon.geometry.coordinates[0].map((coord) => ({
//       x: coord[0],
//       y: coord[1],
//     })),
//   };
// };
