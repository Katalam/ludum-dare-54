import { Application, Graphics } from "pixi.js"
import { Clock } from "./clock";
import { Scheduler } from "./scheduler";
import { Parcel, ParcelInput, Stacks } from "./stacks";
import { Output } from "./output";
import { ScoreBoard as Scoreboard } from "./scoreboard";
import { Destination } from "./destination";

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

    private static readonly PARCEL_SPAWN_TIME = 2.0;
    private static readonly MAX_SCHEDULED_OUTPUT_TASKS = 3;

    private parcelInput: ParcelInput;
    private stacks: Stacks;
    private clock: Clock;
    private scheduler: Scheduler;
    private scoreboard: Scoreboard;
    private outputs: Output[] = [];

    private static readonly AMOUNT_OF_OUTPUTS = 3;

    private selectedParcel: Parcel | undefined;
    private timeUntilNextParcelSpawn = 1.0;

    constructor() {
        super();

        this.stacks = new Stacks();
        this.addChild(this.stacks);

        this.stacks.setOnSelectListener((stackId: number) => this.onStackSelected(stackId));

        this.parcelInput = new ParcelInput();
        this.addChild(this.parcelInput);

        this.clock = new Clock();
        this.addChild(this.clock)

        this.scheduler = new Scheduler();
        this.addChild(this.scheduler);
        this.scheduler.setOnTimeReachedListener((destination: Destination) => this.onScheduledTimeReached(destination));

        this.scoreboard = new Scoreboard();
        this.addChild(this.scoreboard);

        this.spawnOutputs();
        this.layoutChilds();
    }

    private spawnOutputs() {
        for (let i = 0; i < Stage.AMOUNT_OF_OUTPUTS; i++) {
            const output = new Output();

            /**
             * Handles the pointer down event.
             * If the output is occupied, the parcel is right, it will be removed.
             * If the output is occupied, the parcel is wrong, it will do nothing.
             * If the output is not occupied, it will do nothing.
             */
            output.setOnOutputSelectListener((output: Output) => {
                if (!output.isOccupied()) {
                    return;
                }

                const parcel = this.selectedParcel;
                if (parcel === undefined) {
                    return;
                }

                if (parcel.hasSameDestination(output.getDestination()!)) {
                    this.despawnParcel(parcel);
                    this.selectedParcel?.destroy();
                    this.selectedParcel = undefined;
                }
            })
            this.outputs.push(output);
            this.addChild(output);
            output.setDestination(Destination.getRandomDestination());
        }
    }

    private despawnParcel(parcel: Parcel): void {
        const parcelOrigin = parcel.getLocation();
        if (!parcelOrigin) {
            this.parcelInput.despawnParcel();
        } else {
            this.stacks.removeParcelFromStack(parcelOrigin);
        }
    }

    private spawnParcel(): void {
        const parcel = new Parcel(Destination.getRandomDestination());
        parcel.setOnParcelSelectListener((parcel: Parcel) => this.onParcelSelected(parcel));
        this.parcelInput.spawnParcel(parcel);
        this.timeUntilNextParcelSpawn = Stage.PARCEL_SPAWN_TIME;
    }

    private onScheduledTimeReached(destination: Destination): void {
        this.outputs.find(output => !output.isOccupied())?.setDestination(destination);
    }

    private layoutChilds(): void {
        this.parcelInput.y = app.screen.height - 50;
        this.stacks.x = (app.screen.width - Stacks.STACKS * (Stacks.STACK_WIDTH + 20) + 20) / 2;
        this.stacks.y = app.screen.height - 100;
    }

    public update(delta: number) {
        this.layoutChilds();

        this.parcelInput.update(delta);
        this.clock.update(delta);
        this.scheduler.update(delta);
        this.outputs.forEach((output) => output.updateDeltaTime(delta));

        this.timeUntilNextParcelSpawn -= delta;

        if (!this.parcelInput.hasParcel() && this.timeUntilNextParcelSpawn <= 0.0) {
            this.spawnParcel();
        }

        if (this.scheduler.getEntries().length < Stage.MAX_SCHEDULED_OUTPUT_TASKS) {
            const longestTime = this.scheduler.getEntries().length > 0 ? Math.max(...this.scheduler.getEntries().map((item) => item.getTimeUntilArrival())) : 0;
            const time = longestTime + Scheduler.MIN_VALUE_NEXT_TIME + Math.floor(Math.random() * Scheduler.MIN_VALUE_NEXT_TIME);

            this.scheduler.addEntry(time, Destination.getRandomDestination())
        }

        if (this.clock.getTimeLeft() <= 0.0) {
            console.log("Round complete.") // TODO
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

        this.despawnParcel(this.selectedParcel);
        this.stacks.placeParcelOnStack(this.selectedParcel, stackId);
        this.selectedParcel = undefined;
    }
}

setupAndStart();
