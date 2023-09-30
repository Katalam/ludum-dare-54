import { Graphics, IShape } from "pixi.js";

export class ColoredShape<T extends IShape> extends Graphics {

    private shape: T;
    private color: number;

    constructor(shape: T, color: number) {
        super();
        this.shape = shape;
        this.color = color;

        this.redraw();
    }

    public setColor(color: number) {
        this.color = color;
        this.redraw();
    }

    public getColor(): number {
        return this.color;
    }

    public setShape(shape: T) {
        this.shape = shape;
        this.redraw();
    }

    public getShape(): T {
        return this.shape;
    }

    public redraw() {
        this.clear();
        this.beginFill(this.color);
        this.drawShape(this.shape);
        this.endFill();
    }
}