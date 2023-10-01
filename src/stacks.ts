import { FederatedPointerEvent, Graphics, Rectangle } from "pixi.js";
import { ColoredShape } from "./shape";
import { Parcel } from "./parcel";

export type OnStackSelectListener = (stackId: number) => void;
export type OnStackHoverListener = (stackId: number) => void;

export class Stacks extends Graphics {

    public static readonly STACK_WIDTH = 180;
    public static readonly STACKS = 3;

    private parcelStacks: Parcel[][];

    private stacks: ColoredShape<Rectangle>[];

    private onStackSelectListener: OnStackSelectListener | undefined;
    private onStackHoverListener: OnStackHoverListener | undefined;
    private onStackHoverAwayListener: OnStackHoverListener | undefined;

    constructor() {
        super();

        this.parcelStacks = [];
        for (let i = 0; i < Stacks.STACKS; i++) {
            this.parcelStacks.push([]);
        }

        this.stacks = [];
        for (let i = 0; i < Stacks.STACKS; i++) {
            const stack = new ColoredShape<Rectangle>(new Rectangle(i * (Stacks.STACK_WIDTH + 20), 0, Stacks.STACK_WIDTH, 40), 0xFF000);
            stack.on("pointerdown", (interactionEvent: FederatedPointerEvent) => this.onPointerDown(interactionEvent, i));
            stack.on("mouseover", (interactionEvent: FederatedPointerEvent) => this.onMouseOver(interactionEvent, i));
            stack.on("mouseleave", (interactionEvent: FederatedPointerEvent) => this.onMouseLeave(interactionEvent, i));
            this.stacks.push(stack);
            this.addChild(stack);
        }
    }

    public setInteractive(isInteractive: boolean): void {
        this.stacks.forEach(stack => {
            stack.eventMode = isInteractive ? "static" : "passive";
            stack.cursor = isInteractive ? "pointer" : "initial";
        })
    }

    private onPointerDown(interactionEvent: FederatedPointerEvent, stackId: number) {
        // only fire then mouse1 is used
        if (interactionEvent.buttons % 2 === 0) {
            return;
        }

        this.onStackSelectListener?.(stackId);
    }

    private onMouseOver(interactionEvent: FederatedPointerEvent, stackId: number) {
        this.onStackHoverListener?.(stackId);
    }

    private onMouseLeave(interactionEvent: FederatedPointerEvent, stackId: number) {
        this.onStackHoverAwayListener?.(stackId);
    }

    public placeParcelOnStack(parcel: Parcel, stackId: number): void {
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

    public setOnHoverListener(listener: OnStackHoverListener): void {
        this.onStackHoverListener = listener;
    }

    public setOnHoverAwayListener(listener: OnStackHoverListener): void {
        this.onStackHoverAwayListener = listener;
    }

    public getParcelOnTopOfStack(stackId: number): Parcel | undefined {
        if (stackId < 0 || stackId >= Stacks.STACKS) {
            throw new RangeError();
        }

        const parcelStack = this.parcelStacks[stackId]!;

        return parcelStack.filter(parcel => parcel.isOnTopOfStack())[0];
    }

    public clearStacks(): void {
        this.parcelStacks.forEach(parcelStack => {
            parcelStack.forEach(parcel => {
                this.removeChild(parcel);
            });
        });
        this.parcelStacks = this.parcelStacks.map(() => []);
    }
}
