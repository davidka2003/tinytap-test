import { IPoint } from "../types";
import { Shape } from "./shape";

export interface ICanvasState {
  points: IPoint[];
}

export class CanvasState {
  private readonly _state: ICanvasState[] = [];
  private readonly _shapes: Shape[] = [];
  constructor(private readonly canvasContext: CanvasRenderingContext2D, private readonly image: HTMLImageElement) {
    this.nextState();

    canvasContext.fillStyle = "gray";
  }

  public drawShape(points: IPoint[]) {
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

    currentState.points.push(point);
    this._renderPoint(point);
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
    this._renderEmptyArea();
    this._state.push({
      points: [],
    });
  }

  public render() {
    this._state.forEach((state) => {
      state.points.forEach((point) => this._renderPoint(point));
      this._renderEmptyArea();
    });
  }
}
