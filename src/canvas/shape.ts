import { getShapeBoundingBox } from "../utils";
import { IPoint } from "../types";
import { isPolygonsIntersect } from "../utils/polyon-intersection";

export class Shape {
  private readonly _points: IPoint[] = [];
  private _image: string | null = null;
  constructor() {}

  public get points() {
    return this._points;
  }

  public isIntersectsWith(otherShape: Shape) {
    return isPolygonsIntersect({ points: otherShape._points }, { points: this._points });
  }
  public isIntersectsWithMany(otherShapes: Shape[]) {
    for (const otherShape of otherShapes) {
      const intersects = this.isIntersectsWith(otherShape);
      if (intersects) {
        return true;
      }
    }
    return false;
  }

  public pushPoint(point: IPoint) {
    this._points.push(point);
  }

  public get image() {
    return this._image;
  }

  public retrieveImage(initialImage: HTMLImageElement, initialWidth: number, initialHeight: number) {
    if (this._points.length < 3) {
      return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = initialWidth;
    canvas.height = initialHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    // Draw the triangle and set it as the clipping region
    ctx.beginPath();
    ctx.moveTo(this._points[0].x, this._points[0].y);
    this._points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(initialImage, 0, 0, canvas.width, canvas.height);

    const { sx, sy, width, height } = getShapeBoundingBox(this._points);
    const imageData = ctx.getImageData(sx, sy, width, height);

    const clippedCanvas = document.createElement("canvas");
    clippedCanvas.width = imageData.width;
    clippedCanvas.height = imageData.height;
    clippedCanvas.getContext("2d")!.putImageData(imageData, 0, 0);

    // Get the Data URL of the clipped triangle
    const dataUrl = clippedCanvas.toDataURL();

    this._image = dataUrl ?? null;
    return this._image;
  }
}
