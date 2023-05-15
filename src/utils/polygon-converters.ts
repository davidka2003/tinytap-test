import { IPoint, IPolygon } from "../types";

export const getPolygonBoundingBox = (
  shape: IPoint[]
): {
  width: number;
  height: number;
  sx: number;
  sy: number;
} => {
  let [minX, minY] = [Infinity, Infinity];
  let [maxX, maxY] = [0, 0];
  for (let index = 0; index < shape.length; index++) {
    const point = shape[index];
    minX = point.x <= minX ? point.x : minX;
    minY = point.y <= minY ? point.y : minY;

    maxX = point.x >= maxX ? point.x : maxX;
    maxY = point.y >= maxY ? point.y : maxY;
  }

  return {
    sx: minX,
    sy: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const complexPolygonToRectPolygon = (polygon: IPolygon): IPolygon => {
  let [minX, minY] = [Infinity, Infinity];
  let [maxX, maxY] = [0, 0];
  for (let index = 0; index < polygon.points.length; index++) {
    const point = polygon.points[index];
    minX = point.x <= minX ? point.x : minX;
    minY = point.y <= minY ? point.y : minY;

    maxX = point.x >= maxX ? point.x : maxX;
    maxY = point.y >= maxY ? point.y : maxY;
  }
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    points: [
      {
        x: minX,
        y: minY,
      },
      {
        x: minX + width,
        y: minY,
      },
      {
        x: minX + width,
        y: minY + height,
      },
      {
        x: minX,
        y: minY + height,
      },
    ],
  };
};

export const domRectToPolygon = (rect: DOMRect): IPolygon => {
  return {
    points: [
      {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
      },
      {
        x: rect.x + rect.width + window.scrollX,
        y: rect.y + window.scrollY,
      },
      {
        x: rect.x + rect.width + window.scrollX,
        y: rect.y + rect.height + window.scrollY,
      },
      {
        x: rect.x + window.scrollX,
        y: rect.y + rect.height + window.scrollY,
      },
    ],
  };
};
