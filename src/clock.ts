import { Graphics, Text } from "pixi.js";

export class Clock extends Graphics {

    public static readonly WIDTH: number = 200;
    public static readonly HEIGHT: number = 70;

    private static readonly RECTANGLE_COLOR: number = 0x000000;
    private static readonly TEXT_COLOR: number = 0xffffff;

    private text: Text;
    private time: number;

    constructor(deadline: number) {
        super();

        this.time = deadline;
        this.lastBlinkTime = deadline;

        this.beginFill(Clock.RECTANGLE_COLOR);
        this.drawRect(0, 0, Clock.WIDTH, Clock.HEIGHT);
        this.endFill();

        this.text = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: 64,
            fill: Clock.TEXT_COLOR,
            align: "center",
        });

        this.text.x = (this.text.width / 2);

        this.addChild(this.text);
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

        return `${minutes}${this.blinkCharacter}${seconds.toFixed(0).toString().padStart(2, '0')}`;
    }
}
