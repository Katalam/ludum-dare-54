import { Container, Graphics, RoundedRectangle, Text, TextStyle, graphicsUtils } from "pixi.js";

export class ScoreBoard extends Container {

    private static readonly TEXT_STYLE = new TextStyle({
        fontSize: 24,
        fontFamily: "Courier New",
        fill: '#ffffff',
    });

    private textScore: Text;
    private graphics: Graphics = new Graphics();

    private score = 0;

    constructor() {
        super();



        this.addChild(this.graphics);

        this.textScore = new Text(this.scoreString(), ScoreBoard.TEXT_STYLE);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(-4, -4, this.textScore.width + 8, this.textScore.height + 8, 10);
        this.graphics.beginFill(0x1A00BD);
        this.graphics.drawRoundedRect(-2, -2, this.textScore.width + 4, this.textScore.height + 4, 10);
        this.graphics.endFill();
        this.addChild(this.textScore);
    }

    private scoreString(): string {
        return "Score: " + this.score.toString();
    }

    public addScore(points: number) {
        this.score += points;
        this.textScore.text = this.scoreString();
    }

    public setScore(score: number) {
        this.score = score;
        this.textScore.text = this.scoreString();
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore(): void {
        this.score = 0;
        this.textScore.text = this.scoreString();
    }
}
