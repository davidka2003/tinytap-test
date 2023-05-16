import { IPoint, IPolygon } from "../types";
import * as turf from "@turf/turf";

export class Polygon implements IPolygon {
  constructor(public readonly points: IPoint[] = []) {}

  public push(point: IPoint) {
    this.points.push(point);
  }

  /**
   *
   * @param domRect
   * @returns Bounding box Polygon
   */
  static createFromDomRect(domRect: DOMRect) {
    const points = [
      {
        x: domRect.x + window.scrollX,
        y: domRect.y + window.scrollY,
      },
      {
        x: domRect.x + domRect.width + window.scrollX,
        y: domRect.y + window.scrollY,
      },
      {
        x: domRect.x + domRect.width + window.scrollX,
        y: domRect.y + domRect.height + window.scrollY,
      },
      {
        x: domRect.x + window.scrollX,
        y: domRect.y + domRect.height + window.scrollY,
      },
      //close polygon
      {
        x: domRect.x + window.scrollX,
        y: domRect.y + window.scrollY,
      },
    ];
    return new Polygon(points);
  }

  public getCoordinates(): IPoint {
    const boundingBox = this.bb();
    const topLeftCorner = boundingBox.points[0];
    return topLeftCorner;
  }

  public getDimensions(): { width: number; height: number } {
    const bb = this.bb();
    let [minX, minY] = [Infinity, Infinity];
    let [maxX, maxY] = [0, 0];
    for (let index = 0; index < bb.points.length; index++) {
      const point = bb.points[index];
      minX = point.x <= minX ? point.x : minX;
      minY = point.y <= minY ? point.y : minY;

      maxX = point.x >= maxX ? point.x : maxX;
      maxY = point.y >= maxY ? point.y : maxY;
    }

    return {
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   *
   * @param otherPolygon
   * @returns 0 to 1
   */
  public getIntersectionRate(otherPolygon: Polygon): number {
    const turfPolygonA = Polygon.convertToTurfPolygon(this);
    const turfPolygonB = Polygon.convertToTurfPolygon(otherPolygon);
    const intersection = turf.intersect(turfPolygonB, turfPolygonA);
    if (!intersection) {
      return 0;
    }
    const intersectionRate = turf.area(intersection) / turf.area(turfPolygonA);
    console.log({ intersectionRate });
    return intersectionRate;
  }

  public isIntersectsWithOtherPolygon(otherPolygon: Polygon) {
    const turfPolygonA = Polygon.convertToTurfPolygon(this);
    const turfPolygonB = Polygon.convertToTurfPolygon(otherPolygon);
    if (turf.intersect(turfPolygonA, turfPolygonB)) {
      return true;
    }
    return false;
  }

  public isIntersectsWithOtherPolygons(otherPolygons: Polygon[]) {
    for (const otherPolygon of otherPolygons) {
      if (this.isIntersectsWithOtherPolygon(otherPolygon)) {
        return true;
      }
    }
    return false;
  }

  static convertToTurfPolygon(polygon: Polygon) {
    const points = polygon.points.map((point) => [point.x, point.y]);

    return turf.polygon([points]);
  }

  public bb(): Polygon {
    let [minX, minY] = [Infinity, Infinity];
    let [maxX, maxY] = [0, 0];
    for (let index = 0; index < this.points.length; index++) {
      const point = this.points[index];
      minX = point.x <= minX ? point.x : minX;
      minY = point.y <= minY ? point.y : minY;

      maxX = point.x >= maxX ? point.x : maxX;
      maxY = point.y >= maxY ? point.y : maxY;
    }
    const width = maxX - minX;
    const height = maxY - minY;

    return new Polygon([
      //top-left corner
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
      //close polygon
      {
        x: minX,
        y: minY,
      },
    ]);
  }
}
