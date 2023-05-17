import { IPoint } from "../types";
import { Polygon } from "../utils";
import { Puzzle } from "./puzzle";

export class CanvasState {
  private _currentPolygon: Polygon = new Polygon();
  private _puzzles: Puzzle[] = [];
  constructor(private readonly canvasContext: CanvasRenderingContext2D, private readonly image: HTMLImageElement, private readonly inititalCanvasDimensions: { width: number, height: number }) {
    // this.nextState();
    this._attachImage(image);
    canvasContext.fillStyle = "#F5F5F5";
    canvasContext.strokeStyle = "black";
    canvasContext.setLineDash([5, 3])
    canvasContext.lineWidth = 3;
  }

  private _attachImage(image: HTMLImageElement) {
    const { canvas } = this.canvasContext;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  private _createShape(polygon: Polygon): Puzzle {
    const { canvas } = this.canvasContext;
    const shape = Puzzle.create({
      canvasRect: canvas.getBoundingClientRect(),
      initialImage: {
        height: canvas.height,
        width: canvas.width,
        image: this.image,
      },
      polygon,
    });

    this._puzzles.push(shape);
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

  private _reRenderShape(shape: Puzzle) {
    if (!shape.polygon.points.length) {
      return;
    }
    const sx = this.canvasContext.canvas.getBoundingClientRect().width / this.inititalCanvasDimensions.width
    const sy = this.canvasContext.canvas.getBoundingClientRect().height / this.inititalCanvasDimensions.height
    this.canvasContext.beginPath();
    shape.polygon.points/* .map(point => ({
      ////!!!!!!
      x: point.x / sx, y: point.y / sy
    })) */.forEach((point, index) => {
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

  public nextState({ scaleX, scaleY }: { scaleX: number, scaleY: number }) {
    if (this._currentPolygon.points.length < 4) {
      this._currentPolygon = new Polygon();
      return;
    }
    //close polygon
    this._renderNewPoint(this._currentPolygon.points[0]);
    this.canvasContext.closePath();
    this._renderEmptyArea();
    //create shape from current state points
    const currentShape = this._createShape(this._currentPolygon/* .scaleTopLeft({ scaleX: scaleX, scaleY: scaleY }) */);

    //check for intersections with other shapes, if so, delete current state
    if (currentShape.isIntersectsWithMany(this._puzzles.slice(0, -1))) {
      this.deleteStage(this._puzzles.length - 1);
    }
    //reset currentState
    this._currentPolygon = new Polygon();
    //start new path e.g for 1st point in the next state
    this.canvasContext.beginPath();
  }

  public deleteStage(stageIndex: number) {
    this._puzzles.splice(stageIndex, 1);
    this.reRender();
  }

  public reRender() {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    this._attachImage(this.image);
    this.puzzles.forEach((shape) => this._reRenderShape(shape));
  }

  public clearState() {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    this._puzzles = []
  }

  public get puzzles() {
    return this._puzzles;
  }
}
