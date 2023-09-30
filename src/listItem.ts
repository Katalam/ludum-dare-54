import {Graphics, Text} from "pixi.js";

export class ListItem extends Graphics {
    private color: number = 0xffffff;
    public time: number = 0;

    public fixedX: number = 0;
    public fixedY: number = 0;
    public fixedWidth: number = 0;
    public fixedHeight: number = 0;

    private text: Text | undefined;

    constructor(time: number, x: number, y: number, width: number, height: number, color: number) {
        super();

        this.time = time;
        this.color = color;

        this.fixedX = x;
        this.fixedY = y;
        this.fixedWidth = width;
        this.fixedHeight = height;

        this.drawListItem();
    }

    private drawListItem(): this {
        this.clear();
        this.beginFill(this.color);
        this.drawRect(this.fixedX, this.fixedY, this.fixedWidth, this.fixedHeight);
        this.endFill();

        this.drawTimeLeft();

        return this;
    }

    private drawTimeLeft(): void {
        this.text = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: 25,
            fill: 0x000000,
            align: "center",
        });

        this.text.x = this.fixedX - this.text.width + this.fixedWidth - 10;
        this.text.y = this.fixedY;

        this.addChild(this.text)
    }

    private getTextForClock(): string {
        return this.time.toFixed(0).toString();
    }

    public redrawTimeLeft(): void {
        if (this.text) {
            this.text.text = this.getTextForClock();
            this.text.updateText(true);
        }
    }
}