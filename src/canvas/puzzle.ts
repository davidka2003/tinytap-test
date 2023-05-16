import { Polygon } from "../utils";

export class Puzzle {
  public id = crypto.randomUUID();

  private _image: string | null = null;

  private _screenCoordinates = { x: 0, y: 0 };
  private constructor(private readonly _polygon: Polygon = new Polygon()) { }

  public get polygon(): Polygon {
    return this._polygon;
  }

  public getRelatieToScreenTopLeftCoordinate(canvasRect: DOMRect) {
    const bbCoords = this._polygon.getCoordinates();

    return {
      x: canvasRect.x + bbCoords.x,
      y: canvasRect.y + bbCoords.y,
    };
  }
  public getRelativeToScreenShapePolygon(canvasRect: DOMRect): Polygon {
    return new Polygon(
      this.polygon.points.map((point) => ({
        x: point.x + canvasRect.left + window.scrollX,
        //probably need to remove because of sticky
        y: point.y + canvasRect.top + window.scrollY,
      }))
    );
  }
  //only reasonable way is to check by bound boxes
  public isInPlace(currentPolygonBb: Polygon, canvasRect: DOMRect): boolean {
    //absolute coordinates within correct polygon
    const correctPlacePolygonBb = this.getRelativeToScreenShapePolygon(canvasRect).bb();
    const intersectionRate = correctPlacePolygonBb.getIntersectionRate(currentPolygonBb)
    const distanceToClosestCoord = correctPlacePolygonBb.getDistanceToCoordinate(currentPolygonBb.getCoordinates())
    return intersectionRate >= 0.85 || distanceToClosestCoord < 20

  }

  public isIntersectsWith(otherShape: Puzzle) {
    return this._polygon.isIntersectsWithOtherPolygon(otherShape.polygon);
  }
  public isIntersectsWithMany(otherShapes: Puzzle[]) {
    return this._polygon.isIntersectsWithOtherPolygons(otherShapes.map((shape) => shape.polygon));
  }

  static create({
    polygon,
    canvasRect,
    initialImage,
  }: {
    polygon: Polygon;
    canvasRect: DOMRect;
    initialImage: {
      image: HTMLImageElement;
      width: number;
      height: number;
    };
  }) {
    const puzzle = new Puzzle(polygon);
    puzzle.retrieveImage(initialImage.image, initialImage.width, initialImage.height);
    puzzle._screenCoordinates = { ...puzzle.getShapeBoundingBoxCoordinatesRelativeToScreen(canvasRect) };
    return puzzle;
  }

  public get image() {
    return this._image;
  }

  public get screenCoordinates() {
    return this._screenCoordinates;
  }

  public get dimensions() {
    return this._polygon.getDimensions();
  }

  private getShapeBoundingBoxCoordinatesRelativeToScreen(canvasRect: DOMRect) {
    const bbCoords = this._polygon.bb().getCoordinates();
    return {
      x: bbCoords.x + canvasRect.left + window.scrollX,
      //removed because of position sticky
      y: bbCoords.y + canvasRect.top + window.scrollY,
    };
  }
  private retrieveImage(initialImage: HTMLImageElement, initialWidth: number, initialHeight: number) {
    if (this._polygon.points.length < 4) {
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
    ctx.moveTo(this._polygon.points[0].x, this._polygon.points[0].y);
    this._polygon.points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(initialImage, 0, 0, canvas.width, canvas.height);
    const { x, y } = this._polygon.getCoordinates();
    const { width, height } = this._polygon.getDimensions();
    const imageData = ctx.getImageData(x, y, width, height);

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
