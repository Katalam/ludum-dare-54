import { Graphics, Text } from "pixi.js";
import { app, maxTime } from "./index";
import { ListItem } from "./listItem";
import { Destination } from "./destination";

export class Scheduler extends Graphics {

    private static readonly WIDTH: number = 200;
    private static readonly HEIGHT: number = 120;
    private static readonly OFFSET_Y: number = 10;
    private static readonly RECTANGLE_COLOR: number = 0x000000;

    public static readonly MIN_VALUE_NEXT_TIME: number = 10;
    public static readonly ADD_VALUE_NEXT_TIME: number = 10;

    private list: Array<ListItem> = [];
    private time: number;

    constructor() {
        super();

        // Set the initial time and draw the panel rectangle
        this.time = maxTime;
        this.addPanelRectangle();

        // Handle the list of items
        this.handleList(0);
    }

    /**
     * Returns the X offset for the panel rectangle.
     */
    private getOffsetX(): number {
        return (app.screen.width / 4) - (Scheduler.WIDTH / 2);
    }

    /**
     * Draws the panel rectangle with the time left text.
     */
    private addPanelRectangle(): void {
        this.clear();
        this.beginFill(Scheduler.RECTANGLE_COLOR);
        this.drawRect(this.getOffsetX(), Scheduler.OFFSET_Y, Scheduler.WIDTH, Scheduler.HEIGHT);
        this.endFill();
    }

    private addToList(minTime: number): ListItem {
        // Generate a random time between MIN_VALUE_NEXT_TIME and MIN_VALUE_NEXT_TIME + ADD_VALUE_NEXT_TIME
        const time = minTime + Scheduler.MIN_VALUE_NEXT_TIME +
            Math.floor(Math.random() * Scheduler.MIN_VALUE_NEXT_TIME);

        // Create a new ListItem with the generated time
        const rectangle = new ListItem(time, this.getOffsetX(), Scheduler.OFFSET_Y, Scheduler.WIDTH, 30, Destination.getRandomDestination());

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

            if (item.time <= 0.0) {
                // Draw the lightbulb
                // this.drawLightbulb(item.destination);

                this.removeChild(item);
                item.destroy();
            }
        });

        this.list = this.list.filter((item: ListItem) => item.time > 0);

        if (this.list.length < 3) {
            const longestTime = this.list.length > 0 ? Math.max(...this.list.map((item) => item.time)) : 0;

            this.addToList(longestTime);
        }

        this.list.sort((a, b) => b.time - a.time).forEach((item, index) => {
            item.y = Scheduler.OFFSET_Y + index * 40;
        });
    }

    public addDeltaTime(deltaTimeInSeconds: number): void {
        this.time -= deltaTimeInSeconds;

        if (this.time > 0) {
            this.handleList(deltaTimeInSeconds);
        }
    }
}
