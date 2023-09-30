import { FederatedPointerEvent, Graphics, Rectangle, Text } from "pixi.js";
import { ColoredShape } from "./shape";
import { Destination } from "./destination";

export class Parcel extends ColoredShape<Rectangle> {

    public static readonly PARCEL_WIDTH = 150;
    public static readonly PARCEL_HEIGHT = 60;

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

        this.drawText();
    }

    private drawText(): void {
        const text = new Text(this.destination.destination, {

        });
        text.x = this.width / 2 - text.width / 2;
        text.y = this.height / 2 - text.height / 2;

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

export class ParcelInput extends Graphics {

    public static readonly PARCEL_SPAWN_TIME = 2.0;

    private parcelMovementProgression: number | undefined;
    private parcel: Parcel | undefined;

    constructor() {
        super();

        this.redraw();
    }

    public spawnParcel(parcel: Parcel) {
        if (this.parcel !== undefined) {
            throw new Error();
        }

        this.parcel = parcel;
        this.parcel.x = -Parcel.PARCEL_WIDTH;
        this.parcel.y = -Parcel.PARCEL_HEIGHT - 5;

        this.parcelMovementProgression = 0.0;

        this.addChild(this.parcel);
    }

    public hasParcel() {
        return this.parcel !== undefined;
    }

    public despawnParcel() {
        if (this.parcel === undefined) {
            throw new Error();
        }

        this.removeChild(this.parcel);

        this.parcel = undefined;
        this.parcelMovementProgression = undefined;
    }

    public update(delta: number): void {
        if (this.parcel !== undefined && this.parcelMovementProgression !== undefined && this.parcelMovementProgression < 1.0) {
            this.parcelMovementProgression = Math.min(1.0, this.parcelMovementProgression + delta * (1 / ParcelInput.PARCEL_SPAWN_TIME));
            this.parcel.x = -Parcel.PARCEL_WIDTH + this.parcelMovementProgression * (40 + Parcel.PARCEL_WIDTH);
        }
    }

    private redraw(): void {
        this.clear();

        this.beginFill(0xFF000);
        this.drawRect(0, 0, Parcel.PARCEL_WIDTH + 60, 40);
        this.endFill();
    }

}

export type OnStackSelectListener = (stackId: number) => void;

export class Stacks extends Graphics {

    public static readonly STACK_WIDTH = 180;
    public static readonly STACKS = 3;

    private parcelStacks: Parcel[][];

    private onStackSelectListener: OnStackSelectListener | undefined;

    constructor() {
        super();

        this.parcelStacks = [];
        for (let i = 0; i < Stacks.STACKS; i++) {
            this.parcelStacks.push([]);
        }

        for (let i = 0; i < Stacks.STACKS; i++) {
            const stack = new ColoredShape(new Rectangle(i * (Stacks.STACK_WIDTH + 20), 0, Stacks.STACK_WIDTH, 40), 0xFF000);
            stack.eventMode = 'static';
            stack.cursor = 'pointer';
            stack.on("pointerdown", (interactionEvent: FederatedPointerEvent) => this.onPointerDown(interactionEvent, i));
            this.addChild(stack);
        }
    }

    private onPointerDown(interactionEvent: FederatedPointerEvent, stackId: number) {
        // only fire then mouse1 is used
        if (interactionEvent.buttons % 2 === 0) {
            return;
        }

        this.onStackSelectListener?.(stackId);
    }

    public placeParcelOnStack(parcel: Parcel, stackId: number): void {
        console.log("placeParcelOnStack(...,", stackId, ")");
        if (stackId < 0 || stackId >= Stacks.STACKS) {
            throw new RangeError();
        }

        const parcelStack = this.parcelStacks[stackId]!;

        parcelStack[parcelStack.length - 1]?.setOnTopOfStack(false);

        parcelStack.push(parcel);
        this.addChild(parcel);
        parcel.setLocation(stackId);
        parcel.setOnTopOfStack(true);

        parcel.x = stackId * (Stacks.STACK_WIDTH + 20) + 15;
        parcel.y = this.parcelStacks[stackId]!.length * (-Parcel.PARCEL_HEIGHT - 5)
    }

    public removeParcelFromStack(stackId: number) {
        console.log("removeParcelFromStack(", stackId, ")");
        if (stackId < 0 || stackId >= Stacks.STACKS) {
            throw new RangeError();
        }

        const parcelStack = this.parcelStacks[stackId]!;

        const popedParcel = parcelStack.pop();
        if (popedParcel === undefined) {
            throw Error();
        }

        parcelStack[parcelStack.length - 1]?.setOnTopOfStack(true);
        popedParcel.setOnTopOfStack(false);
        this.removeChild(popedParcel);
    }

    public setOnSelectListener(listener: OnStackSelectListener): void {
        this.onStackSelectListener = listener;
    }
}
