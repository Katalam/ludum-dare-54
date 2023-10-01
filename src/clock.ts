import { Graphics, Text } from "pixi.js";

export class Clock extends Graphics {

    public static readonly WIDTH: number = 200;
    public static readonly HEIGHT: number = 70;

    private static readonly RECTANGLE_COLOR: number = 0x1A00BD;
    private static readonly TEXT_COLOR: number = 0xffffff;

    private text: Text;
    private time: number;

    constructor(deadline: number) {
        super();

        this.time = deadline;
        this.lastBlinkTime = deadline;

        this.lineStyle(2, 0x000000);
        this.beginFill(Clock.RECTANGLE_COLOR);
        this.drawRoundedRect(0, 10, Clock.WIDTH, Clock.HEIGHT, 10);
        this.endFill();

        this.text = new Text(this.getTextForClock(), {
            fontFamily: "Courier New",
            fontSize: 64,
            fill: Clock.TEXT_COLOR,
            align: "center",
        });

        this.text.x = (this.text.width / 4) - 10;
        this.text.y = 14;

        this.addChild(this.text);
    }

    public setDeadline(time: number): void {
        this.time = time;
    }

    public update(secondsPast: number): void {
        this.time -= secondsPast;

        if (this.time > 0) {
            this.text.text = this.getTextForClock();
            this.text.updateText(true);
        }
    }

    public getTimeLeft(): number {
        return this.time;
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

        if (seconds.toFixed(0).toString() === '60') {
            return `${minutes + 1}${this.blinkCharacter}00`;
        }

        return `${minutes}${this.blinkCharacter}${seconds.toFixed(0).toString().padStart(2, '0')}`;
    }
}
