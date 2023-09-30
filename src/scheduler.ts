import {Graphics, Rectangle, Text} from "pixi.js";
import {app, maxTime} from "./index";
import {ListItem} from "./listItem";

export class Scheduler extends Graphics {
    private time: number;

    private readonly WIDTH: number = 200;
    private readonly HEIGHT: number = 120;
    private OFFSET_Y: number = 10;
    private readonly RECTANGLE_COLOR: number = 0x000000;

    public MIN_VALUE_NEXT_TIME: number = 10;
    public ADD_VALUE_NEXT_TIME: number = 10;

    private list: Array<ListItem> = [];

    constructor() {
        super();

        this.time = maxTime;

        this.addPanelRectangle();

        this.handleList(0);
    }

    private getOffsetX(): number {
        return (app.screen.width / 4) - (this.WIDTH / 2);
    }

    // Used to draw a rectangle with a text inside
    // representing the time left
    private addPanelRectangle(): void {
        this.clear();
        this.beginFill(this.RECTANGLE_COLOR);
        this.drawRect(this.getOffsetX(), this.OFFSET_Y, this.WIDTH, this.HEIGHT);
        this.endFill();

        app.stage.addChild(this);
    }

    private addToList(minTime: number): ListItem {
        // 1. generate a random number between 10 and 20
        let time = Math.floor(Math.random() * this.MIN_VALUE_NEXT_TIME) + this.MIN_VALUE_NEXT_TIME;
        time += minTime;

        let rectangle = new ListItem(time, this.getOffsetX(), this.OFFSET_Y, this.WIDTH, 30, 0xffffff);

        this.list.push(rectangle);

        this.addChild(rectangle);

        return rectangle;
    }

    // handles the logic in the game loop
    // 1. update the timers
    // 2. remove timers at 0
    // 3. manage the lightbulb
    private handleList(deltaTimeInSeconds: number): void {
        this.list.forEach((item: ListItem) => {
            item.time -= deltaTimeInSeconds;
            item.redrawTimeLeft();

            if (item.time <= 0) {
                this.removeChild(item);
            }
        });

        this.list = this.list.filter((item: ListItem) => {
            return item.time > 0;
        });

        if (this.list.length < 3) {
            // get longest time
            let longestTime = 0;
            this.list.forEach((item: ListItem) => {
                if (item.time > longestTime) {
                    longestTime = item.time;
                }
            });

            this.addToList(longestTime);
        }

        this.list.sort((item: ListItem) => {
            return item.time;
        }).forEach((item: ListItem, index: number) => {
            item.y = this.OFFSET_Y + (index * 40);
        });
    }

    public addDeltaTime(deltaTimeInSeconds: number): void {
        this.time -= deltaTimeInSeconds

        if (this.time > 0) {
            this.handleList(deltaTimeInSeconds);
        }
    }
}
