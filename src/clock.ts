import { Graphics, Text } from "pixi.js";
import { app, maxTime } from "./index";

export class Clock extends Graphics {

    private static readonly WIDTH: number = 200;
    private static readonly HEIGHT: number = 70;
    private static readonly OFFSET_Y: number = 10;
    private static readonly RECTANGLE_COLOR: number = 0x000000;
    private static readonly TEXT_COLOR: number = 0xffffff;

    private text: Text | undefined;
    private time: number;

    constructor() {
        super();

        this.time = maxTime;
        this.lastBlinkTime = maxTime;

        this.addClockRectangle();
        this.drawTimeLeft();
    }

    public update(secondsPast: number): void {
        this.time -= secondsPast;

        if (this.time > 0) {
            this.redrawTimeLeft();
        }
    }

    public getTimeLeft(): number {
        return this.time;
    }

    private getOffsetX(): number {
        return (app.screen.width / 2) - (Clock.WIDTH / 2);
    }

    /**
     * Draws a rectangle with a text inside representing the time left.
     */
    private addClockRectangle(): void {
        this.clear();

        this.beginFill(Clock.RECTANGLE_COLOR);
        this.drawRect(this.getOffsetX(), Clock.OFFSET_Y, Clock.WIDTH, Clock.HEIGHT);
        this.endFill();
    }

    /**
     * Draws the time left inside the rectangle.
     */
    private drawTimeLeft(): void {
        this.text = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: 64,
            fill: Clock.TEXT_COLOR,
            align: "center",
        });

        this.text.x = this.getOffsetX() + (this.text.width / 2);
        this.text.y = Clock.OFFSET_Y;

        this.addChild(this.text);
    }

    private redrawTimeLeft(): void {
        if (this.text) {
            this.text.text = this.getTextForClock();
            this.text.updateText(true);
        }
    }

    private lastBlinkTime: number = 0;
    private blinkCharacter: string = ":";

    private getTextForClock(): string {
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time - (minutes * 60);

        // Blink the character every other second
        if (this.lastBlinkTime - this.time > 1) {
            this.lastBlinkTime = this.time;
            this.blinkCharacter = this.blinkCharacter === " " ? ":" : " ";
        }

        return `${minutes}${this.blinkCharacter}${seconds.toFixed(0).toString().padStart(2, '0')}`;
    }
}
