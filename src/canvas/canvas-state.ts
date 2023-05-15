import { IPoint, IPolygon } from "../types";
import { isPolygonIntersectsBulk, isPolygonsIntersect } from "../utils/polyon-intersection";
import { Shape } from "./shape";

export interface ICanvasState {
  points: IPoint[];
}

export class CanvasState {
  private readonly _state: ICanvasState[] = [
    {
      points: [],
    },
  ];
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

  private _drawShape(points: IPoint[]) {
    const { canvas } = this.canvasContext;
    const shape = new Shape();
    points.forEach((point) => shape.pushPoint(point));
    shape.retrieveImage(this.image, canvas.width, canvas.height);
    this._shapes.push(shape);
  }

  public pushPointToState(point: IPoint) {
    const currentState = this._state.at(-1);
    if (!currentState) {
      return;
    }
    if (!currentState.points.length) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(point.x, point.y);
    }

    currentState.points.push(point);
    this._renderPoint(point);
  }

  private _renderState(state: ICanvasState) {
    if (!state.points.length) {
      return;
    }

    this.canvasContext.beginPath();
    state.points.forEach((point, index) => {
      if (index === 0) {
        this.canvasContext.moveTo(point.x, point.y);
      }
      this._renderPoint(point);
    });

    this._renderPoint(state.points[0]);

    this.canvasContext.closePath();
    this._renderEmptyArea();
  }

  private _renderPoint(point: IPoint) {
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
    const currentState = this._state.at(-1);
    if (!currentState) {
      return;
    }

    this._renderPoint(currentState.points[0]);
    this._drawShape(currentState.points);
    this.canvasContext.closePath();
    this._renderEmptyArea();
    //check for intersections with other shapes, if so, delete current state
    const currentShape = this._shapes.at(-1);
    if (!currentShape) {
      throw "No Shape";
    }
    if (currentShape.isIntersectsWithMany(this._shapes.slice(0, -1))) {
      this.deleteStage(this._state.length - 1);
    }

    this._state.push({
      points: [],
    });
    this.canvasContext.beginPath();
  }

  public deleteStage(stageIndex: number) {
    this._state.splice(stageIndex, 1);
    this._shapes.splice(stageIndex, 1);
    this.render();
  }

  public render() {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    this._attachImage(this.image);
    this._state.forEach((state) => this._renderState(state));
  }

  public get shapes() {
    return this._shapes;
  }
}
