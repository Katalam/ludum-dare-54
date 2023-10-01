import { Graphics, Text } from "pixi.js";
import { Destination } from "./destination";
import { Output } from "./output";

export type TimeReachedListener = (destination: Destination) => void;

export class Scheduler extends Graphics {

    public static readonly WIDTH: number = 280;
    private static readonly HEIGHT: number = 130;
    private static readonly OFFSET_Y: number = 10;
    private static readonly RECTANGLE_COLOR: number = 0x1A00BD;

    public static readonly MIN_VALUE_NEXT_TIME: number = Output.EXIT_TIME_IN_SECONDS + 2;
    public static readonly ADD_VALUE_NEXT_TIME: number = 5;

    private entries: Array<Entry> = [];
    private timeReachedListener: TimeReachedListener | undefined;

    constructor() {
        super();

        this.clear();
        this.beginFill(0x000000);
        this.drawRoundedRect(-2, -2, Scheduler.WIDTH + 4, Scheduler.HEIGHT + 5, 10);
        this.beginFill(Scheduler.RECTANGLE_COLOR);
        this.drawRoundedRect(0, 0, Scheduler.WIDTH, Scheduler.HEIGHT, 10);
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

    public static readonly HEIGHT = 18;

    private destination: Destination;
    private time: number;
    private textTime: Text;

    constructor(time: number, destination: Destination) {
        super();

        this.time = time;
        this.destination = destination;

        this.beginFill(this.destination.getColor());
        this.drawRect(Scheduler.WIDTH / 4 + 40, Entry.HEIGHT / 3, Scheduler.WIDTH / 7, Entry.HEIGHT);
        this.beginFill(0xffffff);
        this.drawRect(Scheduler.WIDTH / 3, Entry.HEIGHT / 3, 4, Entry.HEIGHT);
        this.drawRect(Scheduler.WIDTH / 4 * 2 + 20, Entry.HEIGHT / 3, 4, Entry.HEIGHT);
        this.drawRect(Scheduler.WIDTH / 4 * 3 + 20, Entry.HEIGHT / 3, 4, Entry.HEIGHT);
        this.endFill();

        this.textTime = new Text(this.getTextForClock(), {
            fontFamily: "Arial",
            fontSize: Entry.HEIGHT,
            fill: 0xffffff,
            align: "center",
        });
        this.addChild(this.textTime)
        this.textTime.x = Scheduler.WIDTH - this.textTime.width - 10;
        this.textTime.y = 4;

        const textDestination = new Text(this.destination.getName(), {
            fontFamily: "Arial",
            fontSize: Entry.HEIGHT,
            fill: 0xffffff,
            align: "center",
        });
        this.addChild(textDestination);
        textDestination.x = 10;
        textDestination.y = 4;

        const textDestinationShort = new Text(this.destination.destination, {
            fontFamily: "Arial",
            fontSize: Entry.HEIGHT,
            fill: 0xffffff,
            align: "center",
        });
        this.addChild(textDestinationShort);
        textDestinationShort.x = 175;
        textDestinationShort.y = 4;
    }

    private getTextForClock(): string {
        return this.time.toFixed(0).toString().padStart(2, '0');
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
