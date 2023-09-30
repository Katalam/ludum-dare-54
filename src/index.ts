import { Application, IShape, Graphics } from "pixi.js"
import { Clock } from "./clock";
import { Scheduler } from "./scheduler";

let stage: Stage;
let clock: Clock;
let scheduler: Scheduler;

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

    // add a clock to the stage
    clock = new Clock();
    app.stage.addChild(clock)

	// add the scheduler to the stage
	scheduler = new Scheduler();
	app.stage.addChild(scheduler);
}

/**
 * This class represents the main container for any further objects in the game,
 * global event listeners, central game logic and other elements of the game.
 * 
 * An instance is added to the root element of the scene graph and updated regularly by the game loop.
 */
class Stage extends Graphics {

    constructor() {
        super();
    }

    public update(delta: number) {
        clock.addDeltaTime(delta);
        scheduler.addDeltaTime(delta);
    }
}

class ColoredShape<T extends IShape> extends Graphics {

    private shape: T;
    private color: number;

    constructor(shape: T, color: number) {
        super();
        this.shape = shape;
        this.color = color;

        this.redraw();
    }

    public setColor(color: number) {
        this.color = color;
        this.redraw();
    }

    public setShape(shape: T) {
        this.shape = shape;
        this.redraw();
    }

    public getShape(): T {
        return this.shape;
    }

    public redraw() {
        this.clear();
        this.beginFill(this.color);
        this.drawShape(this.shape);
        this.endFill();
    }
}

setupAndStart();
