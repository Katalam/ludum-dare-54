import { Destination } from './destination';
import { Graphics, Text } from 'pixi.js';
import { app } from './index';

export class Output extends Graphics {

    private static readonly EXIT_TIME_IN_SECONDS: number = 5;

    private destination: Destination | undefined;
    private deltaTime: number = 0;
    private startTime: number = 0;

    private lightbulb: Graphics | undefined;
    private text: Text | undefined;

    constructor(destination?: Destination) {
        super();

        this.destination = destination;
    }

    public isOccupied(): boolean {
        return this.destination !== undefined
    }

    public getDestination(): Destination | undefined {
        return this.destination;
    }

    /**
     * Sets the destination of the output.
     * Will handle the lightbulb animation.
     * @param destination 
     */
    public setDestination(destination: Destination): void {
        this.destination = destination;
        this.startTime = this.deltaTime;

        this.drawLightbulb();
    }

    /**
     * Updates the deltaTime.
     * If the deltaTime is greater than 5 seconds, the destination will be cleared.
     * Have to be called every frame.
     * 
     * @param deltaTime The time in seconds since the last frame.
     */
    public updateDeltaTime(deltaTime: number): void {
        this.deltaTime = deltaTime;

        // Clear the destination after 5 seconds
        if (this.startTime + Output.EXIT_TIME_IN_SECONDS < this.deltaTime) {
            this.clearDestination();
        }
    }

    private clearDestination(): void {
        this.destination = undefined;

        this.startTime = 0;

        this.text?.destroy();
        this.lightbulb?.destroy();
        this.text = undefined;
        this.lightbulb = undefined;
    }

    private drawLightbulb(): void {
        if (this.destination === undefined) {
            return;
        }

        const x = app.screen.width - 100;
        const y = app.screen.height - 200;

        this.lightbulb = new Graphics();
        this.lightbulb.beginFill(this.destination.getColor());
        this.lightbulb.drawCircle(x, y, 20);
        this.lightbulb.endFill();

        this.text = new Text(this.destination.destination, { fill: 0xf, fontSize: 20 });
        this.text.x = x - this.lightbulb.width / 2 + this.text.width / 4;
        this.text.y = y - this.lightbulb.height / 2 + this.text.width / 5;

        this.addChild(this.lightbulb);
        this.addChild(this.text);
    }
}
