import { Graphics, Text, TextStyle } from "pixi.js";
import { Sounds } from "./sounds";

export class ScoreBoard extends Graphics {

    private static readonly TEXT_STYLE = new TextStyle({
        fontSize: 24,
        fontFamily: "Courier New",
        fill: '#ffffff',
    });

    private textScore: Text;
    private score = 0;

    constructor() {
        super();

        this.textScore = new Text(this.scoreString(), ScoreBoard.TEXT_STYLE);
        this.addChild(this.textScore);
        this.redraw();
    }

    private redraw(): void {
        this.clear();

        this.lineStyle(2, 0x000000);
        this.beginFill(0x1A00BD);
        this.drawRoundedRect(-2, -2, this.textScore.width + 4, this.textScore.height + 4, 10);
        this.endFill();
    }

    private scoreString(): string {
        return "Score: " + this.score.toString();
    }

    public addScore(points: number) {
        this.score += points;
        this.textScore.text = this.scoreString();
        this.redraw();
        Sounds.playSoundScore();
    }

    public setScore(score: number) {
        this.score = score;
        this.textScore.text = this.scoreString();
        this.redraw();
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore(): void {
        this.setScore(0);
    }
}
