import { Application, Graphics } from "pixi.js"
import { Clock } from "./clock";
import { Scheduler } from "./scheduler";
import { Parcel, ParcelInput, Stacks } from "./stacks";

let stage: Stage;

export const maxTime: number = 300;

// Get the HTML wrapper element, start up a pixi.js application and add its canvas element to the wrapper.
const wrapper = document.getElementById("wrapper");
export const app = new Application<HTMLCanvasElement>({ antialias: true, backgroundColor: 0x66ffff, resizeTo: wrapper !== null ? wrapper : window });
document.getElementById("wrapper")?.appendChild(app.view);

/**
 * Updates the model and view for the new frame.
 * 
 * @param secondsPast Amount of seconds past since last call of the game loop.
 */
function gameLoop(secondsPast: number): void {
    stage.update(secondsPast);
}

/**
 * Setups the game, shows the stage and starts the game loop.
 */
function setupAndStart(): void {
    stage = new Stage();
    app.stage.addChild(stage);

    // the handler is called roughly 60 times per second
    // delta is a factor of how many reference frames past since last call
    // multiplying by 1/60 transforms this in seconds since last call
    const MOVEMENT_FACTOR = 1.0 / 60.0;
    app.ticker.add((delta: number) => gameLoop(delta * MOVEMENT_FACTOR));
}

/**
 * This class represents the main container for any further objects in the game,
 * global event listeners, central game logic and other elements of the game.
 * 
 * An instance is added to the root element of the scene graph and updated regularly by the game loop.
 */
class Stage extends Graphics {

    private parcelInput: ParcelInput;
    private stacks: Stacks;
    private clock: Clock;
    private scheduler: Scheduler;

    private selectedParcel: Parcel | undefined;

    constructor() {
        super();

        this.stacks = new Stacks();
        this.stacks.x = 400;
        this.stacks.y = 500;
        this.addChild(this.stacks);

        this.stacks.setOnSelectListener((stackId: number) => this.onStackSelected(stackId));

        this.parcelInput = new ParcelInput();
        this.parcelInput.y = 700;
        this.addChild(this.parcelInput);

        const parcel = new Parcel(Math.random() * 0xFFFFFF);
        parcel.setOnParcelSelectListener((p: Parcel) => this.onParcelSelected(p));
        this.parcelInput.spawnParcel(parcel);

        this.clock = new Clock();
        this.addChild(this.clock)

        this.scheduler = new Scheduler();
        this.addChild(this.scheduler);
    }

    public update(delta: number) {
        this.clock.addDeltaTime(delta);
        this.scheduler.addDeltaTime(delta);
        this.parcelInput.update(delta);

        if (!this.parcelInput.hasParcel()) {
            const parcel = new Parcel(Math.random() * 0xFFFFFF);
            parcel.setOnParcelSelectListener((parcel: Parcel) => this.onParcelSelected(parcel));
            this.parcelInput.spawnParcel(parcel);
        }
    }

    private onParcelSelected(parcel: Parcel) {
        if (typeof (parcel.getLocation()) === "number" && !parcel.isOnTopOfStack()) {
            return;
        }

        this.selectedParcel = parcel;
    }

    private onStackSelected(stackId: number) {
        if (this.selectedParcel === undefined) {
            return;
        }

        const parcelOrigin = this.selectedParcel.getLocation();
        if (parcelOrigin === undefined) {
            this.parcelInput.despawnParcel();
        } else {
            this.stacks.removeParcelFromStack(parcelOrigin);
        }

        this.stacks.placeParcelOnStack(this.selectedParcel, stackId);
        this.selectedParcel = undefined;
    }
}

setupAndStart();
