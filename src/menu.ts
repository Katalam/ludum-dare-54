import { Container, TextStyle, Graphics, Text } from "pixi.js";
import { app, gameState } from "./index";

export class Menu extends Container {

    private static TITLE_STYLE = new TextStyle({
        fontSize: 128,
        fontWeight: 'bold',
        fill: [
            "#0bace1",
            "#73c1df"
        ],
        stroke: "#0707e2",
        strokeThickness: 3
    });

    private static BUTTON_STYLE = new TextStyle({
        fontSize: 86,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        lineJoin: 'round',
    });

    private static TEXT_STYLE = new TextStyle({
        fontSize: 36,
        fontStyle: "italic",
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
        fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
        lineJoin: 'round'
    });

    private titleText: Text;
    private startText: Text;
    private infoText: Text;
    private howToText: Text;

    private startButton: Graphics;
    private howToButton: Graphics;

    private startButtonHover = false;
    private howToButtonHover = false;

    constructor(onRestartGameListener: () => void) {
        super();

        this.zIndex = 10;

        this.startButton = new Graphics();
        this.startButton.eventMode = "static";
        this.startButton.cursor = "pointer";
        this.startButton.on("pointerover", () => {
            this.startButtonHover = true;
            this.redraw();
        });
        this.startButton.on("pointerout", () => {
            this.startButtonHover = false;
            this.redraw();
        });
        this.startButton.on("pointerdown", () => {
            if (gameState === "menu") {
                onRestartGameListener();
                this.startButtonHover = false;
                this.redraw();
            } else if (gameState === "gameover") {
                onRestartGameListener();
                this.startButtonHover = false;
                this.redraw();
            }
        });
        this.addChild(this.startButton);

        this.howToButton = new Graphics();
        this.howToButton.eventMode = "static";
        this.howToButton.cursor = "pointer";
        this.howToButton.on("pointerover", () => {
            this.howToButtonHover = true;
            this.redraw();
        });
        this.howToButton.on("pointerout", () => {
            this.howToButtonHover = false;
            this.redraw();
        });
        this.howToButton.on("pointerdown", () => {
            if (gameState === "menu") {
                this.displayHowTo();
                this.howToButtonHover = false;
            }
        });
        this.addChild(this.howToButton);

        this.titleText = new Text("Parcel Mover", Menu.TITLE_STYLE);
        this.titleText.x = app.screen.width / 2 - this.titleText.width / 2;
        this.titleText.y = 30;
        this.addChild(this.titleText);

        this.startText = new Text("Start Game", Menu.BUTTON_STYLE);
        this.startText.x = app.screen.width / 2 - this.startText.width / 2;
        this.startText.y = 275;
        this.addChild(this.startText);

        this.howToText = new Text("How To Play", Menu.BUTTON_STYLE);
        this.howToText.x = app.screen.width / 2 - this.howToText.width / 2;
        this.howToText.y = 525;
        this.addChild(this.howToText);

        this.infoText = new Text("A game made in 72 hours for Ludum Dare 54", Menu.TEXT_STYLE);
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        this.infoText.y = app.screen.height - 80;
        this.addChild(this.infoText);

        this.redraw();
    }

    public displayLost(score: number) {
        this.howToButton.visible = false;
        this.howToText.visible = false;

        this.infoText.text = `You delivered ${score} parcels!`
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        this.infoText.y = 275;

        this.startText.text = "Restart";
        this.startText.x = app.screen.width / 2 - this.startText.width / 2;
        this.startText.y = 720;

        this.titleText.text = "Shift Done"
        this.titleText.x = app.screen.width / 2 - this.titleText.width / 2;
        this.titleText.y = 30;

        this.redraw();
    }

    public displayHowTo() {
        this.infoText.text = "Sort the incoming parcels and deliver them to the correct output.\n\n" +
            "Earn points by delivering parcels to the correct output while it is active.\n\n" +
            "Controls: Click (or touch) a parcel to select it.\nThen click on a destination to move the parcel."
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        this.infoText.y = 180;

        this.howToButton.visible = false;
        this.howToText.visible = false;

        this.startText.y = app.screen.height - 180;
        this.redraw();
    }

    public redraw() {
        // Start Game - Button
        this.startButton.clear();

        this.startButton.lineStyle(5, 0x0707e2);
        if (this.startButtonHover) {
            this.startButton.beginFill(0x00FFFF, 0.5);
        } else {
            this.startButton.beginFill(0, 0.5);
        }

        this.startButton.drawRoundedRect((app.screen.width - 540) / 2, this.startText.y - 20, 540, this.startText.height + 40, 30);
        this.startButton.endFill();

        // How to Play - Button
        this.howToButton.clear();

        this.howToButton.lineStyle(5, 0x0707e2);
        if (this.howToButtonHover) {
            this.howToButton.beginFill(0x00FFFF, 0.5);
        } else {
            this.howToButton.beginFill(0, 0.5);
        }

        this.howToButton.drawRoundedRect((app.screen.width - 540) / 2, this.howToText.y - 20, 540, this.howToText.height + 40, 30);
        this.howToButton.endFill();
    }
}