import { Graphics, Texture, Sprite } from "pixi.js";
import { Parcel } from "./parcel";

export class ParcelInput extends Graphics {

    public static readonly PARCEL_SPAWN_TIME = 2.0;

    private parcelMovementProgression: number | undefined;
    private parcel: Parcel | undefined;

    private onParcelInputSelectListener: ((parcelInput: ParcelInput) => void) | undefined;

    constructor() {
        super();

        this.redraw();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on("mouseover", () => this.onMouseOver());
        this.on("mouseleave", () => this.onMouseLeave());
        this.on("pointerdown", () => this.onParcelInputSelectListener?.(this));
    }

    public setOnParcelInputSelectListener(listener: (parcelInput: ParcelInput) => void): void {
        this.onParcelInputSelectListener = listener;
    }

    private onMouseOver(): void {
        if (this.parcel === undefined) {
            return;
        }

        this.parcel.setHoverState(true);
    }

    private onMouseLeave(): void {
        if (this.parcel === undefined) {
            return;
        }

        this.parcel.setHoverState(false);
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

    public getParcel(): Parcel | undefined {
        return this.parcel;
    }

    public despawnParcel() {
        if (this.parcel === undefined) {
            return
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

        const texture = Texture.from("assets/conveyable.png");
        const sprite = new Sprite(texture);

        sprite.x = -50;
        sprite.width = Parcel.PARCEL_WIDTH + 110;
        sprite.height = 40;

        this.addChild(sprite);
    }

}
