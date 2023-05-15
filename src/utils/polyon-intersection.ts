//A' ∩ B intersection
//https://qph.cf2.quoracdn.net/main-qimg-51cc903ca424eeecf5fe89b874419cab-lq

import { IPoint, IPolygon } from "../types";
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
  // Check if any of the vertices of polygonA are outside polygonB
  for (let i = 0; i < polygonA.points.length; i++) {
    const point = polygonA.points[i];
    if (!isPointInsidePolygon(point, polygonB)) {
      break;
    } else {
      return true;
    }
  }

  // Check if any of the edges of polygonA intersect with polygonB
  for (let i = 0; i < polygonA.points.length; i++) {
    const currentA = polygonA.points[i];
    const nextA = polygonA.points[(i + 1) % polygonA.points.length];

    for (let j = 0; j < polygonB.points.length; j++) {
      const currentB = polygonB.points[j];
      const nextB = polygonB.points[(j + 1) % polygonB.points.length];

      if (doSegmentsIntersect(currentA, nextA, currentB, nextB)) {
        return true;
      }
    }
  }

  return false;
};

const isPointInsidePolygon = (point: IPoint, polygon: IPolygon): boolean => {
  let isInside = false;
  const totalPoints = polygon.points.length;

  for (let i = 0, j = totalPoints - 1; i < totalPoints; j = i++) {
    const current = polygon.points[i];
    const previous = polygon.points[j];

    if (
      current.y > point.y !== previous.y > point.y &&
      point.x < ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
};

const doSegmentsIntersect = (p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint): boolean => {
  const d1 = direction(p3, p4, p1);
  const d2 = direction(p3, p4, p2);
  const d3 = direction(p1, p2, p3);
  const d4 = direction(p1, p2, p4);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  } else if (d1 === 0 && onSegment(p3, p4, p1)) {
    return true;
  } else if (d2 === 0 && onSegment(p3, p4, p2)) {
    return true;
  } else if (d3 === 0 && onSegment(p1, p2, p3)) {
    return true;
  } else if (d4 === 0 && onSegment(p1, p2, p4)) {
    return true;
  }

  return false;
};

const direction = (pi: IPoint, pj: IPoint, pk: IPoint): number => {
  return (pk.x - pi.x) * (pj.y - pi.y) - (pj.x - pi.x) * (pk.y - pi.y);
};

const onSegment = (pi: IPoint, pj: IPoint, pk: IPoint): boolean => {
  return (
    Math.min(pi.x, pj.x) <= pk.x &&
    pk.x <= Math.max(pi.x, pj.x) &&
    Math.min(pi.y, pj.y) <= pk.y &&
    pk.y <= Math.max(pi.y, pj.y)
  );
};
