import { Container, TextStyle, Graphics, Text } from "pixi.js";
import { app, gameState } from "./index";

export class Menu extends Container {
    private static readonly PRIMARY_BLUE = 0x1A00BD;

    private static TITLE_STYLE = new TextStyle({
        fontSize: 80,
        fontFamily: "Courier New",
        fontWeight: 'bold',
        align: 'center',
        fill: '#ffffff',
        stroke: "#1A00BD",
        strokeThickness: 6
    });

    private static BUTTON_STYLE = new TextStyle({
        fontSize: 86,
        fontFamily: "Courier New",
        fill: '#ffffff',
    });

    private static TEXT_STYLE = new TextStyle({
        fontSize: 36,
        fontStyle: "italic",
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        fontFamily: "Courier New",
    });

    private titleText: Text;
    private startText: Text;
    private infoText: Text;
    private howToText: Text;

    private startButton: Graphics;
    private howToButton: Graphics;

    private startButtonHover = false;
    private howToButtonHover = false;

    private displayState: "menu" | "lost" | "howto" = "menu";

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

        this.titleText = new Text("Speedy Deliveries", Menu.TITLE_STYLE);
        this.titleText.x = app.screen.width / 2 - this.titleText.width / 2;
        this.titleText.y = 40;
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
        this.infoText.y = app.screen.height - 160;
        this.addChild(this.infoText);

        this.redraw();
    }

    public displayLost(score: number) {
        this.displayState = "lost";
        this.howToButton.visible = false;
        this.howToText.visible = false;

        this.infoText.text = `You delivered ${score} parcels!`
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        this.infoText.y = 180;

        this.startText.text = "Restart";
        this.startText.x = app.screen.width / 2 - this.startText.width / 2;
        this.startText.y = app.screen.height / 2;

        this.titleText.text = "Shift Done"
        this.titleText.x = app.screen.width / 2 - this.titleText.width / 2;
        this.titleText.y = 80;

        this.redraw();
    }

    public displayHowTo() {
        this.displayState = "howto";
        this.infoText.text = "Pick up the the incoming parcels and stack\nthem in the middle. When a destination becomes\navailable, " +
            "deliver the parcels to earn points.\n\n" +
            "Controls: Click (or touch) a parcel to select it.\nThen click on a destination to move the parcel."
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        this.infoText.y = app.screen.height / 4;

        this.howToButton.visible = false;
        this.howToText.visible = false;

        this.startText.y = app.screen.height - 180;
        this.redraw();
    }

    public redraw() {
        // Start Game - Button
        this.startButton.clear();

        this.startButton.lineStyle(5, Menu.PRIMARY_BLUE);
        if (this.startButtonHover) {
            this.startButton.beginFill(Menu.PRIMARY_BLUE, 0.5);
        } else {
            this.startButton.beginFill(Menu.PRIMARY_BLUE, 1.0);
        }

        this.startButton.drawRoundedRect((app.screen.width - this.startText.width) / 2 - 10, this.startText.y - 20, this.startText.width + 20, this.startText.height + 40, 30);
        this.startButton.endFill();

        // How to Play - Button
        this.howToButton.clear();

        this.howToButton.lineStyle(5, Menu.PRIMARY_BLUE);
        if (this.howToButtonHover) {
            this.howToButton.beginFill(Menu.PRIMARY_BLUE, 0.5);
        } else {
            this.howToButton.beginFill(Menu.PRIMARY_BLUE, 1.0);
        }

        this.howToButton.drawRoundedRect(
            (app.screen.width - this.howToText.width) / 2 - 10, this.howToText.y - 20,
            this.howToText.width + 20, this.howToText.height + 40,
            30
        );
        this.howToButton.endFill();
    }

    public resize() {
        this.titleText.x = app.screen.width / 2 - this.titleText.width / 2;
        this.startText.x = app.screen.width / 2 - this.startText.width / 2;
        this.howToText.x = app.screen.width / 2 - this.howToText.width / 2;
        this.infoText.x = app.screen.width / 2 - this.infoText.width / 2;
        if (this.displayState === "menu") {
            this.infoText.y = app.screen.height - 160; // 
        } else if (this.displayState === "lost") {
            this.startText.y = app.screen.height / 2;
        } else if (this.displayState === "howto") {
            this.startText.y = app.screen.height - 180;
            this.infoText.y = app.screen.height / 4;
        }

        this.redraw();
    }
}
