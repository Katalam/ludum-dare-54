import { Destination } from './destination';
import { Graphics, Text } from 'pixi.js';
import { Parcel } from './parcel';

export class Output extends Graphics {

    private static readonly EXIT_TIME_IN_SECONDS: number = 5;

    private destination: Destination | undefined;
    private time: number = 0;
    private startTime: number = 0;

    private lightbulb: Graphics;
    private text: Text;

    private onOutputSelectListener: ((output: Output) => void) | undefined;

    constructor(destination?: Destination) {
        super();

        this.destination = destination;

        this.beginFill(0xFF000);
        this.drawRect(0, 0, Parcel.PARCEL_WIDTH + 60, 40);
        this.endFill();

        this.lightbulb = new Graphics();
        this.text = new Text(undefined, { fill: 0xf, fontSize: 20 });
        this.addChild(this.lightbulb);
        this.addChild(this.text);
        this.drawLightbulb();

        this.eventMode = 'static';
        this.on('pointerdown', () => this.onOutputSelectListener?.(this))
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
        this.cursor = "pointer";
        this.startTime = this.time;

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
        this.time += deltaTime;

        // Clear the destination after 5 seconds
        if (this.startTime + Output.EXIT_TIME_IN_SECONDS < this.time) {
            this.clearDestination();
        }
    }

    public clearDestination(): void {
        this.destination = undefined;
        this.cursor = "initial";
        this.startTime = 0;
        this.drawLightbulb();
    }

    private drawLightbulb(): void {
        if (this.destination === undefined) {
            this.text.visible = false;
            this.lightbulb.visible = false;
            return;
        }

        this.text.visible = true;
        this.lightbulb.visible = true;

        this.lightbulb.beginFill(this.destination.getColor());
        this.lightbulb.drawCircle(0, 0, 40);
        this.lightbulb.endFill();
        this.lightbulb.x = (Parcel.PARCEL_WIDTH + 60) / 2;
        this.lightbulb.y = 20;

        this.text.text = this.destination.destination;
        this.text.updateText(true);
        this.text.x = -this.text.width / 2 + (Parcel.PARCEL_WIDTH + 60) / 2;
        this.text.y = -this.text.height / 2 + 20;
    }

    public setOnOutputSelectListener(listener: (output: Output) => void): void {
        this.onOutputSelectListener = listener;
    }
}
