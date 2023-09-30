import { Application, Rectangle, IShape, FederatedPointerEvent, Graphics, Color } from "pixi.js"

import { colliding } from './collisions';

const RED: number = new Color("red").toNumber();
const BLUE: number = new Color("blue").toNumber();
const YELLOW: number = new Color("yellow").toNumber();

let stage: Stage;

// Get the HTML wrapper element, start up a pixi.js application and add its canvas element to the wrapper.
const wrapper = document.getElementById("wrapper");
const app = new Application<HTMLCanvasElement>({ antialias: true, backgroundColor: 0x66ffff, resizeTo: wrapper !== null ? wrapper : window });
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

    private player: Player;
    private platforms: Platform[];

    private moveForwardPressed: boolean;
    private moveReversePressed: boolean;

    constructor() {
        super();

        this.moveForwardPressed = false;
        this.moveReversePressed = false;
        document.addEventListener("keydown", event => this.onKeyDown(event));
        document.addEventListener("keyup", event => this.onKeyUp(event));

        this.player = new Player();
        this.addChild(this.player);

        this.platforms = [];
        this.addPlatform(500, 500);
        this.addPlatform(650, 400);
        this.addPlatform(300, 200);
        this.addPlatform(800, 150);

        this.redraw();
    }

    private addPlatform(x: number, y: number): void {
        const platform = new Platform(new Rectangle(x - 50, y - 25, 100, 50));

        this.addChild(platform);
        this.platforms.push(platform)
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key === "d") {
            this.moveForwardPressed = true;
        } else if (event.key === "a") {
            this.moveReversePressed = true;
        } else if (event.key === "w") {
            this.player.jump();
        }

        this.updatePlayerMovementDirection();
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.key === "d") {
            this.moveForwardPressed = false;
        } else if (event.key === "a") {
            this.moveReversePressed = false;
        }

        this.updatePlayerMovementDirection();
    }

    private updatePlayerMovementDirection(): void {
        if (this.moveForwardPressed && !this.moveReversePressed) {
            this.player.setMovementDirection("Forward");
        } else if (this.moveReversePressed && !this.moveForwardPressed) {
            this.player.setMovementDirection("Reverse");
        } else {
            this.player.setMovementDirection("No");
        }
    }

    private redraw() {
        this.clear();

        this.beginFill(0x006600);
        this.drawRect(-150, 600, app.view.width - 100, app.view.height - 600);

        this.endFill();
    }

    public update(delta: number) {
        // update player
        this.player.update(delta);

        // update platforms
        this.platforms.forEach((platform) => platform.update(this.player.y));

        // handle collions
        let collided = false;
        this.platforms.forEach((platform) => {
            if (colliding(platform.getShape(), this.player.getShape())) {
                // do nothing, when velocity is upward
                if (this.player.isMovingUpward() || platform.isAbovePlayer()) {
                    return;
                }

                this.player.y = platform.getShape().top - 19;
                this.player.setVelocityY(0.0);
                this.player.setOnFloor(true);

                this.player.setColor(BLUE);
                collided = true;
                return;
            }
        });
        if (!collided) {
            this.player.setColor(YELLOW);
            if (this.player.y < 600) {
                this.player.setOnFloor(false);
            }
        }

        // update the stage
        this.x = 200 - this.player.x;

        // update the view
        this.redraw();
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

class Platform extends ColoredShape<Rectangle> {

    private abovePlayer: boolean;

    constructor(shape: Rectangle) {
        super(shape, RED);

        this.abovePlayer = true;
    }

    public isAbovePlayer(): boolean {
        return this.abovePlayer;
    }

    public update(playerY: number): void {
        this.abovePlayer = this.getShape().top <= playerY;
    }

}

type MovementDirection = "Forward" | "Reverse" | "No";

class Player extends ColoredShape<Rectangle> {

    private readonly MOVEMENT_SPEED_X = 20;
    private readonly GRAVITY = 500;

    private velocityY: number;
    private onFloor: boolean;
    private movementX: MovementDirection;

    constructor() {
        super(new Rectangle(-20, -20, 40, 40), YELLOW)

        this.velocityY = 0;
        this.onFloor = false;
        this.movementX = "No";

        this.on("pointerdown", (interactionEvent: FederatedPointerEvent) => this.onPointerDown(interactionEvent));
        this.eventMode = "static";
    }

    private onPointerDown(interactionEvent: FederatedPointerEvent) {
        if (interactionEvent.buttons % 2 == 0) {
            return;
        }

        this.jump();
    }

    public setOnFloor(onFloor: boolean): void {
        this.onFloor = onFloor;
    }

    public jump() {
        if (!this.onFloor) {
            return;
        }

        this.onFloor = false;
        this.velocityY = -500;
    }

    public setVelocityY(velocityY: number): void {
        this.velocityY = velocityY;
    }

    public setMovementDirection(moveDir: MovementDirection): void {
        this.movementX = moveDir;
    }

    public update(delta: number): void {
        if (!this.onFloor) {
            this.velocityY = Math.min(this.velocityY + this.GRAVITY * delta, this.GRAVITY);
            this.y += this.velocityY * delta;

            if (this.y >= 600) {
                this.y = 600;
                this.velocityY = 0.0;
                this.onFloor = true;
            }
        }

        if (this.movementX !== "No") {
            this.x += this.movementX === "Forward" ? this.MOVEMENT_SPEED_X : -this.MOVEMENT_SPEED_X;
        }
    }

    public override getShape(): Rectangle {
        return new Rectangle(this.x - 20, this.y - 20, 40, 40);
    }

    public isMovingUpward(): boolean {
        return this.velocityY < 0;
    }
}

setupAndStart();