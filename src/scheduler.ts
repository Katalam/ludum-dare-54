import { Graphics, Rectangle, Text } from "pixi.js";
import { app, maxTime } from "./index";
import { ListItem } from "./listItem";
import { Destination } from "./destination";

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

        // Set the initial time and draw the panel rectangle
        this.time = maxTime;
        this.addPanelRectangle();

        // Handle the list of items
        this.handleList(0);
    }

    // Get the X offset for the panel rectangle
    private getOffsetX(): number {
        return (app.screen.width / 4) - (this.WIDTH / 2);
    }

    // Draw the panel rectangle with the time left text
    private addPanelRectangle(): void {
        this.clear();
        this.beginFill(this.RECTANGLE_COLOR);
        this.drawRect(this.getOffsetX(), this.OFFSET_Y, this.WIDTH, this.HEIGHT);
        this.endFill();

        // Add the panel rectangle to the stage
        app.stage.addChild(this);
    }

    // Add a new item to the list
    private addToList(minTime: number): ListItem {
        // Generate a random time between MIN_VALUE_NEXT_TIME and MIN_VALUE_NEXT_TIME + ADD_VALUE_NEXT_TIME
        let time = Math.floor(Math.random() * this.MIN_VALUE_NEXT_TIME) + this.MIN_VALUE_NEXT_TIME;
        time += minTime;

        // Create a new ListItem with the generated time
        let rectangle = new ListItem(time, this.getOffsetX(), this.OFFSET_Y, this.WIDTH, 30, Destination.getRandomDestination());

        // Add the ListItem to the list and to the Scheduler
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
                // Draw the lightbulb
                this.drawLightbulb(item.destination);

                this.removeChild(item);
            }
        });

        this.list = this.list.filter((item: ListItem) => item.time > 0);

        if (this.list.length < 3) {
            const longestTime = this.list.length > 0 ? Math.max(...this.list.map((item) => item.time)) : 0;

            this.addToList(longestTime);
        }

        this.list.sort((a, b) => b.time - a.time).forEach((item, index) => {
            item.y = this.OFFSET_Y + index * 40;
        });
    }

    public addDeltaTime(deltaTimeInSeconds: number): void {
        this.time -= deltaTimeInSeconds

        if (this.time > 0) {
            this.handleList(deltaTimeInSeconds);
        }
    }

    private drawLightbulb(destination: Destination): void {
        const x = app.screen.width - 100;
        const y = app.screen.height - 200;

        let lightbulb = new Graphics();
        lightbulb.beginFill(destination.getColor());
        lightbulb.drawCircle(x, y, 20);
        lightbulb.endFill();

        let text = new Text(destination.destination, { fill: 0xf, fontSize: 20 });
        text.x = x - lightbulb.width / 2 + text.width / 4;
        text.y = y - lightbulb.height / 2 + text.width / 5;

        this.addChild(lightbulb);
        this.addChild(text);

        setTimeout(() => {
            this.removeChild(lightbulb);
            this.removeChild(text);
        }, 5000);
    }
}
