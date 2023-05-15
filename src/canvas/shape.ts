import { complexPolygonToRectPolygon, getPolygonBoundingBox } from "../utils";
import { IPoint, IPolygon } from "../types";
import { isPolygonsIntersect } from "../utils/polyon-intersection";

export class Shape {
  public get id() {
    return this._points.reduce<number>((acc, point) => point.x + point.y + acc, 0);
  }
  private readonly _points: IPoint[] = [];
  private _image: string | null = null;

  private _coordinates = { x: 0, y: 0 };
  private _dimensions = { width: 0, height: 0 };
  private constructor() {}

  public get polygon(): IPolygon {
    return { points: this._points };
  }

  public getRelatieToScreenTopLeftCoordinate(canvasRect: DOMRect) {
    const bb = getPolygonBoundingBox(this._points);

    return {
      x: canvasRect.x + bb.sx,
      y: canvasRect.y + bb.sy,
    };
  }
  public getRelativeToScreenShapePolygon(canvasRect: DOMRect): IPolygon {
    return {
      points: this._points.map((point) => ({
        x: point.x + canvasRect.left + window.scrollX,
        //probably need to remove because of sticky
        y: point.y + canvasRect.top + window.scrollY,
      })),
    };
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

  static create({
    points,
    canvasRect,
    initialImage,
  }: {
    points: IPoint[];
    canvasRect: DOMRect;
    initialImage: {
      image: HTMLImageElement;
      width: number;
      height: number;
    };
  }) {
    const shape = new Shape();
    points.forEach((point) => shape.pushPoint(point));
    shape.retrieveImage(initialImage.image, initialImage.width, initialImage.height);
    shape._coordinates = { ...shape.getShapeBoundingBoxCoordinatesRelativeToScreen(canvasRect) };
    shape._dimensions = shape.getDimensions();
    return shape;
  }

  private pushPoint(point: IPoint) {
    this._points.push(point);
  }

  public get image() {
    return this._image;
  }

  public get coordinates() {
    return this._coordinates;
  }

  public get dimensions() {
    return this._dimensions;
  }

  private getShapeBoundingBoxCoordinatesRelativeToScreen(canvasRect: DOMRect) {
    const { sx, sy, width, height } = getPolygonBoundingBox(this._points);
    return {
      x: sx + canvasRect.left + window.scrollX,
      //removed because of position sticky
      y: sy + canvasRect.top, //+ window.scrollY,
    };
  }

  private getDimensions() {
    const { width, height } = getPolygonBoundingBox(this._points);
    return { width, height };
  }
  private retrieveImage(initialImage: HTMLImageElement, initialWidth: number, initialHeight: number) {
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

    const { sx, sy, width, height } = getPolygonBoundingBox(this._points);
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
