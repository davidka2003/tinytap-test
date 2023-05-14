import { IPoint } from "../types";

export const getShapeBoundingBox = (
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
