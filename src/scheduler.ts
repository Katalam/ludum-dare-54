import { Graphics, Text } from "pixi.js";
import { Destination } from "./destination";

export type TimeReachedListener = (destination: Destination) => void;

export class Scheduler extends Graphics {

    public static readonly WIDTH: number = 240;
    private static readonly HEIGHT: number = 120;
    private static readonly OFFSET_Y: number = 10;
    private static readonly RECTANGLE_COLOR: number = 0x000000;

    public static readonly MIN_VALUE_NEXT_TIME: number = 10;
    public static readonly ADD_VALUE_NEXT_TIME: number = 10;

    private entries: Array<Entry> = [];
    private timeReachedListener: TimeReachedListener | undefined;

    constructor() {
        super();

        this.clear();
        this.beginFill(Scheduler.RECTANGLE_COLOR);
        this.drawRect(0, 0, Scheduler.WIDTH, Scheduler.HEIGHT);
        this.endFill();

        this.update(0.0);
    }

    public addEntry(timeUntilArrival: number, destination: Destination): void {
        const entry = new Entry(timeUntilArrival, destination);
        this.entries.push(entry);
        this.addChild(entry);
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

    public static readonly HEIGHT = 30;

    private destination: Destination;
    private time: number;
    private textTime: Text;

    constructor(time: number, destination: Destination) {
        super();

        this.time = time;
        this.destination = destination;

        this.beginFill(this.destination.getColor());
        this.drawRect(0, 0, Scheduler.WIDTH, Entry.HEIGHT);
        this.endFill();

        this.textTime = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: 25,
            fill: 0x000000,
            align: "center",
        });
        this.addChild(this.textTime)
        this.textTime.x = Scheduler.WIDTH - this.textTime.width - 10;

        const textDestination = new Text(this.destination.getName());
        this.addChild(textDestination);
        textDestination.x = 10;
    }

    private getTextForClock(): string {
        return this.time.toFixed(0).toString();
    }

    public update(secondsPast: number): void {
        this.time -= secondsPast;

        this.textTime.text = this.getTextForClock();
        this.textTime.updateText(true);
    }

    public getTimeUntilArrival(): number {
        return this.time;
    }

    public getDestination(): Destination {
        return this.destination;
    }
}
