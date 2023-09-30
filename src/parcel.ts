import { FederatedPointerEvent, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { ColoredShape } from "./shape";
import { Destination } from "./destination";

export class Parcel extends ColoredShape<Rectangle> {

    public static readonly PARCEL_WIDTH = 80;
    public static readonly PARCEL_HEIGHT = 48;

    private onParcelSelectListener: ((parcel: Parcel) => void) | undefined;
    private location: number | undefined;
    private onTopOfStack = false;

    private destination: Destination;

    constructor(destination: Destination) {
        super(new Rectangle(0, 0, Parcel.PARCEL_WIDTH, Parcel.PARCEL_HEIGHT), destination.getColor());
        this.destination = destination;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        // this.lineStyle(2, 0x000000);

        this.on("pointerdown", (interactionEvent: FederatedPointerEvent) => this.onPointerDown(interactionEvent));

        this.addBadge();
        this.drawText();
    }

    private addBadge(): void {
        const backgroundTexture = Texture.from("assets/badge.png");
        const background = new Sprite(backgroundTexture);
        background.width = Parcel.PARCEL_WIDTH;
        background.height = Parcel.PARCEL_HEIGHT;

        this.addChild(background);

        const colorTexture = Texture.from("assets/parcel_band.png");
        const color = new Sprite(colorTexture);
        color.tint = this.destination.getColor();
        color.width = Parcel.PARCEL_WIDTH;
        color.height = Parcel.PARCEL_HEIGHT;

        this.addChild(color);
    }

    private drawText(): void {
        const text = new Text(this.destination.destination, {
            fontSize: 18,
        });
        text.x = this.width / 2 - text.width / 2 + 5;
        text.y = this.height / 2 - text.height / 2 + 1;

        this.addChild(text);
    }

    private onPointerDown(interactionEvent: FederatedPointerEvent) {
        if (interactionEvent.buttons % 2 === 0) {
            return;
        }

        this.onParcelSelectListener?.(this);
    }

    public setOnParcelSelectListener(listener: (parcel: Parcel) => void): void {
        this.onParcelSelectListener = listener;
    }

    public setLocation(location: number | undefined): void {
        this.location = location;
    }

    public getLocation(): number | undefined {
        return this.location;
    }

    public setOnTopOfStack(isOnTopOfStack: boolean): void {
        this.onTopOfStack = isOnTopOfStack;
    }

    public isOnTopOfStack(): boolean {
        return this.onTopOfStack;
    }

    public hasSameDestination(destination: Destination): boolean {
        return this.destination.destination === destination.destination;
    }
}
