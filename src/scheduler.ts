import { Graphics, Text } from "pixi.js";
import { app } from "./index";
import { Destination } from "./destination";

export type TimeReachedListener = (destination: Destination) => void;

export class Scheduler extends Graphics {

    private static readonly WIDTH: number = 200;
    private static readonly HEIGHT: number = 120;
    private static readonly OFFSET_Y: number = 10;
    private static readonly RECTANGLE_COLOR: number = 0x000000;

    public static readonly MIN_VALUE_NEXT_TIME: number = 10;
    public static readonly ADD_VALUE_NEXT_TIME: number = 10;

    private entries: Array<Entry> = [];
    private timeReachedListener: TimeReachedListener | undefined;

    constructor() {
        super();

        this.drawPanelRectangle();
        this.update(0.0);
    }

    /**
     * Returns the X offset for the panel rectangle.
     */
    private static getOffsetX(): number {
        return (app.screen.width / 4) - (Scheduler.WIDTH / 2);
    }

    /**
     * Draws the panel background.
     */
    private drawPanelRectangle(): void {
        this.clear();
        this.beginFill(Scheduler.RECTANGLE_COLOR);
        this.drawRect(Scheduler.getOffsetX(), Scheduler.OFFSET_Y, Scheduler.WIDTH, Scheduler.HEIGHT);
        this.endFill();
    }

    public addEntry(timeUntilArrival: number, destination: Destination): void {
        const rectangle = new Entry(timeUntilArrival, Scheduler.getOffsetX(), Scheduler.OFFSET_Y, Scheduler.WIDTH, 30, destination);

        this.entries.push(rectangle);
        this.addChild(rectangle);
    }

    public getEntries(): Entry[] {
        return this.entries;
    }

    public setOnTimeReachedListener(timeReachedListener: TimeReachedListener): void {
        this.timeReachedListener = timeReachedListener;
    }

    /**
     * Updates the schedule to the new state after the given seconds past.
     * 
     * Updates the timers, removes entries with a time of zero
     * and calles the event listener as required.
     * 
     * @param secondsPast Amount of seconds past since last update.
     */
    public update(secondsPast: number): void {
        this.entries.forEach((entry: Entry) => {
            entry.update(secondsPast);

            if (entry.getTimeUntilArrival() <= 0.0) {
                this.removeChild(entry);
                this.timeReachedListener?.(entry.getDestination());
                entry.destroy();
            }
        });

        this.entries = this.entries.filter((item: Entry) => item.getTimeUntilArrival() > 0.0);

        this.entries.sort((a, b) => b.getTimeUntilArrival() - a.getTimeUntilArrival()).forEach((item, index) => {
            item.y = Scheduler.OFFSET_Y + index * 40;
        });
    }
}

class Entry extends Graphics {

    private destination: Destination;
    private time: number = 0;

    private fixedX: number = 0;
    private fixedY: number = 0;
    private fixedWidth: number = 0;
    private fixedHeight: number = 0;

    private text: Text | undefined;

    constructor(time: number, x: number, y: number, width: number, height: number, destination: Destination) {
        super();

        this.time = time;
        this.destination = destination;

        this.fixedX = x;
        this.fixedY = y;
        this.fixedWidth = width;
        this.fixedHeight = height;

        this.drawListItem();
    }

    private drawListItem(): this {
        this.clear();
        this.beginFill(this.destination.getColor());
        this.drawRect(this.fixedX, this.fixedY, this.fixedWidth, this.fixedHeight);
        this.endFill();

        this.drawTimeLeft();
        this.drawDestination();

        return this;
    }

    private drawDestination() {
        const text = new Text(this.destination.getName());
        text.x = this.fixedX + 10;
        text.y = this.fixedY;

        this.addChild(text);
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

    public update(secondsPast: number): void {
        this.time -= secondsPast;

        if (this.text) {
            this.text.text = this.getTextForClock();
            this.text.updateText(true);
        }
    }

    public getTimeUntilArrival(): number {
        return this.time;
    }

    public getDestination(): Destination {
        return this.destination;
    }
}
