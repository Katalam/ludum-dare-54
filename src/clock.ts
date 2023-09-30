import {Graphics, Text} from "pixi.js";
import {app, maxTime} from "./index";

export class Clock extends Graphics {
    private time: number;

    private readonly WIDTH: number = 200;
    private readonly HEIGHT: number = 70;
    private OFFSET_Y: number = 10;
    private readonly RECTANGLE_COLOR: number = 0x000000;
    private readonly TEXT_COLOR: number = 0xffffff;

    private text: Text | undefined;

    constructor() {
        super();

        this.time = maxTime;

        this.addClockRectangle();
        this.drawTimeLeft();
    }

    public addDeltaTime(deltaTimeInSeconds: number): void {
        this.time -= deltaTimeInSeconds

        if (this.time > 0) {
            this.redrawTimeLeft();
        }
    }

    // Returns half of the width of the screen minus of the width of the rectangle
    private getOffsetX(): number {
        return (app.screen.width / 2) - (this.WIDTH / 2);
    }

    // Used to draw a rectangle with a text inside
    // representing the time left
    private addClockRectangle(): void {
        this.clear();
        this.beginFill(this.RECTANGLE_COLOR);
        this.drawRect(this.getOffsetX(), this.OFFSET_Y, this.WIDTH, this.HEIGHT);
        this.endFill();

        app.stage.addChild(this);
    }

    // Used to draw the time left
    // inside the rectangle
    private drawTimeLeft(): void {
        this.text = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: 64,
            fill: this.TEXT_COLOR,
            align: "center",
        });

        this.text.x = this.getOffsetX() + (this.text.width / 2);
        this.text.y = this.OFFSET_Y;

        this.addChild(this.text)
    }

    private redrawTimeLeft(): void {
        if (this.text) {
            this.text.text = this.getTextForClock();
            this.text.updateText(true);
        }
    }

    private getTextForClock(): string {
        return this.time.toFixed(0).toString();
    }
}
