import { Application, Graphics, Texture, TilingSprite } from "pixi.js"
import { Clock } from "./clock";
import { Scheduler } from "./scheduler";
import { ParcelInput, Stacks } from "./stacks";
import { Parcel } from "./parcel";
import { Output } from "./output";
import { ScoreBoard as Scoreboard } from "./scoreboard";
import { Destination } from "./destination";
import { Menu } from "./menu";

let stage: Stage;
export let gameState: "menu" | "running" | "gameover" = "menu";

// Get the HTML wrapper element, start up a pixi.js application and add its canvas element to the wrapper.
const wrapper = document.getElementById("wrapper");
export const app = new Application<HTMLCanvasElement>({ antialias: true, resizeTo: wrapper !== null ? wrapper : window });
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
    private static readonly DEADLINE = 2 * 60;
    private static readonly ACTIVATE_NEW_DESTINATIONS_AFTER = Stage.DEADLINE / 3;
    private static readonly AMOUNT_OF_OUTPUTS = 1;

    private parcelInput: ParcelInput;
    private stacks: Stacks;
    private clock: Clock;
    private scheduler: Scheduler;
    private scoreboard: Scoreboard;
    private menu: Menu;
    private outputs: Output[] = [];

    private selectedParcel: Parcel | undefined;
    private timeUntilNextParcelSpawn = 1.0;

    private activeDestinations: Destination[] = [];

    constructor() {
        super();

        // Load the background image and create a sprite with it
        const backgroundTexture = Texture.from("assets/wallpaper.png");
        const background = new TilingSprite(backgroundTexture, app.screen.width, app.screen.height);

        // Add the background to the stage
        app.stage.addChild(background);

        this.menu = new Menu(() => this.restart());
        this.addChild(this.menu);

        this.stacks = new Stacks();
        this.stacks.setOnSelectListener((stackId: number) => this.onStackSelected(stackId));
        this.addChild(this.stacks);

        this.parcelInput = new ParcelInput();
        this.addChild(this.parcelInput);

        this.clock = new Clock(Stage.DEADLINE);
        this.clock.visible = false;
        this.addChild(this.clock)

        this.scheduler = new Scheduler();
        this.addChild(this.scheduler);
        this.scheduler.x = 20;
        this.scheduler.y = 20;
        this.scheduler.visible = false;
        this.scheduler.setOnTimeReachedListener((destination: Destination) => this.onScheduledTimeReached(destination));

        this.scoreboard = new Scoreboard();
        this.scoreboard.visible = false;
        this.addChild(this.scoreboard);
        this.scoreboard.y = 10;

        this.spawnOutputs();
        this.layoutChilds();

        this.sortChildren();
    }

    private restart(): void {
        gameState = "running";

        this.menu.visible = false;

        this.clock.visible = true;
        this.scheduler.visible = true;
        this.scoreboard.visible = true;
        this.stacks.setInteractive(true);
        this.outputs.forEach(output => {
            output.setInteractive(true);
            output.clearDestination();
        });

        this.clock.setDeadline(Stage.DEADLINE);
        this.parcelInput.despawnParcel();

        this.stacks.clearStacks();

        this.scoreboard.resetScore();

        this.activeDestinations = [Destination.getDestinationByIndex(0), Destination.getDestinationByIndex(1), Destination.getDestinationByIndex(2), Destination.getDestinationByIndex(3)];
        this.scheduler.addEntry(5, Destination.getRandomDestination(4));
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
                    this.scoreboard.addScore(1);
                }
            })
            this.outputs.push(output);
            this.addChild(output);
            output.setDestination(Destination.getRandomDestination());
        }
    }

    private despawnParcel(parcel: Parcel): void {
        const parcelOrigin = parcel.getLocation();
        if (parcelOrigin === undefined) {
            this.parcelInput.despawnParcel();
        } else {
            this.stacks.removeParcelFromStack(parcelOrigin);
        }
    }

    private spawnParcel(destination: Destination): void {
        const parcel = new Parcel(destination);
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
        this.scoreboard.x = app.screen.width - 200;
        this.clock.x = (app.screen.width - Clock.WIDTH) / 2;
        this.outputs.forEach((output, index) => {
            output.x = app.screen.width - Parcel.PARCEL_WIDTH - 60;
            output.y = app.screen.height - 50 - index * (Parcel.PARCEL_HEIGHT + 150);
        })
    }

    public update(delta: number) {
        this.layoutChilds();

        if (gameState === "running") {
            this.parcelInput.update(delta);
            this.clock.update(delta);
            this.scheduler.update(delta);
            this.outputs.forEach((output) => output.updateDeltaTime(delta));

            if (this.clock.getTimeLeft() < Stage.DEADLINE - Stage.ACTIVATE_NEW_DESTINATIONS_AFTER && this.activeDestinations.length < 5) {
                this.activeDestinations.push(Destination.getDestinationByIndex(4));
            } else if (this.clock.getTimeLeft() < Stage.DEADLINE - 2 * Stage.ACTIVATE_NEW_DESTINATIONS_AFTER && this.activeDestinations.length < 6) {
                this.activeDestinations.push(Destination.getDestinationByIndex(5));
            }

            this.timeUntilNextParcelSpawn -= delta;

            if (!this.parcelInput.hasParcel() && this.timeUntilNextParcelSpawn <= 0.0) {
                this.spawnParcel(Destination.getRandomDestination(this.activeDestinations.length));
            }

            if (this.scheduler.getEntries().length < Stage.MAX_SCHEDULED_OUTPUT_TASKS) {
                const longestTime = this.scheduler.getEntries().length > 0 ? Math.max(...this.scheduler.getEntries().map((item) => item.getTimeUntilArrival())) : 0;
                const time = longestTime + Scheduler.MIN_VALUE_NEXT_TIME + Math.floor(Math.random() * Scheduler.ADD_VALUE_NEXT_TIME);

                // prevent same destinations in a row
                let availableDestinations = this.activeDestinations.slice();
                const scheduledOutputs = this.scheduler.getEntries()[0];
                if (scheduledOutputs !== undefined) {
                    availableDestinations = availableDestinations.filter(destination => destination !== scheduledOutputs.getDestination());
                }
                const chosenDestination = availableDestinations[Math.floor(Math.random() * availableDestinations.length)];
                if (chosenDestination !== undefined) {
                    this.scheduler.addEntry(time, chosenDestination);
                }
            }

            if (this.clock.getTimeLeft() <= 0.0) {
                this.menu.displayLost(this.scoreboard.getScore());
                this.menu.visible = true;
                gameState = "gameover";
            }
        }
    }

    private onParcelSelected(parcel: Parcel) {
        if (typeof (parcel.getLocation()) === "number" && !parcel.isOnTopOfStack()) {
            return;
        }

        this.selectedParcel = parcel;
        this.selectedParcel.setBorderSelectedVisible(true);
    }

    private onStackSelected(stackId: number) {
        if (this.selectedParcel === undefined) {
            this.selectedParcel = this.stacks.getParcelOnTopOfStack(stackId);
            this.selectedParcel?.setBorderSelectedVisible(true);

            return;
        }

        this.despawnParcel(this.selectedParcel);
        this.stacks.placeParcelOnStack(this.selectedParcel, stackId);
        this.selectedParcel.setBorderSelectedVisible(false);
        this.selectedParcel = undefined;
    }
}

setupAndStart();
