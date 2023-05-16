import { IPoint } from "../types";
import { Polygon } from "../utils";
import { Shape } from "./shape";

export class CanvasState {
  private _currentPolygon: Polygon = new Polygon();
  private readonly _shapes: Shape[] = [];
  constructor(private readonly canvasContext: CanvasRenderingContext2D, private readonly image: HTMLImageElement) {
    // this.nextState();
    this._attachImage(image);
    canvasContext.fillStyle = "gray";
    canvasContext.strokeStyle = "green";
    canvasContext.lineWidth = 5;
  }

  private _attachImage(image: HTMLImageElement) {
    const { canvas } = this.canvasContext;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  private _createShape(polygon: Polygon): Shape {
    const { canvas } = this.canvasContext;
    const shape = Shape.create({
      canvasRect: canvas.getBoundingClientRect(),
      initialImage: {
        height: canvas.height,
        width: canvas.width,
        image: this.image,
      },
      polygon,
    });

    this._shapes.push(shape);
    return shape;
  }

  public pushPointToState(point: IPoint) {
    if (!this._currentPolygon.points.length) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(point.x, point.y);
    }
    this._currentPolygon.push(point);
    this._renderPoint(point);
  }

  private _reRenderShape(shape: Shape) {
    if (!shape.polygon.points.length) {
      return;
    }

    this.canvasContext.beginPath();
    shape.polygon.points.forEach((point, index) => {
      if (index === 0) {
        this.canvasContext.moveTo(point.x, point.y);
      }
      this._renderPoint(point);
    });

    this.canvasContext.closePath();
    this._renderEmptyArea();
  }

  private _renderPoint(point: IPoint) {
    this.canvasContext.lineTo(point.x, point.y);
    this.canvasContext.stroke();
  }

  private _renderNewPoint(point: IPoint) {
    this._currentPolygon.push(point);
    this.canvasContext.lineTo(point.x, point.y);
    this.canvasContext.stroke();
  }

  private _renderEmptyArea() {
    this.canvasContext.save();
    this.canvasContext.clip();
    this.canvasContext.fillStyle = "gray";
    this.canvasContext.fill();
    this.canvasContext.restore();
  }

  public nextState() {
    if (this._currentPolygon.points.length < 4) {
      this._currentPolygon = new Polygon();
      return;
    }
    //close polygon
    this._renderNewPoint(this._currentPolygon.points[0]);
    this.canvasContext.closePath();
    this._renderEmptyArea();
    //create shape from current state points
    const currentShape = this._createShape(this._currentPolygon);

    //check for intersections with other shapes, if so, delete current state
    if (currentShape.isIntersectsWithMany(this._shapes.slice(0, -1))) {
      this.deleteStage(this._shapes.length - 1);
    }
    //reset currentState
    this._currentPolygon = new Polygon();
    //start new path e.g for 1st point in the next state
    this.canvasContext.beginPath();
  }

  public deleteStage(stageIndex: number) {
    this._shapes.splice(stageIndex, 1);
    this.reRender();
  }

  public reRender() {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    this._attachImage(this.image);
    this.shapes.forEach((shape) => this._reRenderShape(shape));
  }

  public get shapes() {
    return this._shapes;
  }
}
