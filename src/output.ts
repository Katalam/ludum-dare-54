import { Destination } from './destination';
import { Graphics, Sprite, Text, Texture } from 'pixi.js';
import { Parcel } from './parcel';
import { Sounds } from './sounds';

export class Output extends Graphics {

    public static readonly EXIT_TIME_IN_SECONDS: number = 8;

    private destination: Destination | undefined;
    private timeUntilDeparture: number = 0;

    private lightbulb: Graphics;
    private text: Text;

    private onOutputSelectListener: ((output: Output) => void) | undefined;

    constructor(destination?: Destination) {
        super();

        this.destination = destination;

        const texture = Texture.from("assets/conveyable.png");
        const sprite = new Sprite(texture);

        sprite.x = 10;
        sprite.width = Parcel.PARCEL_WIDTH + 110;
        sprite.height = 40;

        this.addChild(sprite);

        this.lightbulb = new Graphics();
        this.lightbulb.x = (Parcel.PARCEL_WIDTH + 60) / 2;
        this.lightbulb.y = -45;
        this.text = new Text(undefined, { fill: 0xf, fontSize: 20 });
        this.addChild(this.lightbulb);
        this.addChild(this.text);
        this.redraw();

        this.on('pointerdown', () => this.onOutputSelectListener?.(this))
    }

    public setInteractive(isInteractive: boolean): void {
        this.eventMode = isInteractive ? 'static' : 'passive';
        this.cursor = isInteractive && this.destination !== undefined ? 'pointer' : 'inital';
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
        this.timeUntilDeparture = Output.EXIT_TIME_IN_SECONDS;

        this.redraw();
    }

    /**
     * Updates the output to the state for the next frame.
     * 
     * @param secondsPast The time in seconds since the last frame.
     */
    public update(secondsPast: number): void {
        if (this.timeUntilDeparture > 0.0) {
            this.timeUntilDeparture -= secondsPast;
        }

        if (this.timeUntilDeparture <= 0.0 && this.destination !== undefined) {
            this.clearDestination();
        } else {
            this.redraw();
        }
    }

    public clearDestination(playSound: boolean = true): void {
        if (playSound) {
            Sounds.playSoundTruckExit();
        }

        this.destination = undefined;
        this.cursor = "initial";
        this.redraw();
    }

    private redraw(): void {
        if (this.destination === undefined) {
            this.text.visible = false;
            this.lightbulb.visible = false;
            return;
        }

        this.text.visible = true;
        this.lightbulb.visible = true;

        this.lightbulb.clear();
        this.lightbulb.beginFill(this.destination.getColor());
        this.lightbulb.drawCircle(0, 0, 40);
        this.lightbulb.endFill();

        this.lightbulb.lineStyle(6, 0x1A00BD);
        this.lightbulb.arc(0, 0, 40, 0, (-this.timeUntilDeparture / Output.EXIT_TIME_IN_SECONDS) * 2 * Math.PI);

        this.text.text = this.destination.destination;
        this.text.updateText(true);
        this.text.x = -this.text.width / 2 + (Parcel.PARCEL_WIDTH + 60) / 2;
        this.text.y = -this.text.height / 2 - 45;
    }

    public setOnOutputSelectListener(listener: (output: Output) => void): void {
        this.onOutputSelectListener = listener;
    }
}
