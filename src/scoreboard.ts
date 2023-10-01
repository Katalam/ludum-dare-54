import { Container, Text, TextStyle } from "pixi.js";

export class ScoreBoard extends Container {

    private static readonly TEXT_STYLE = new TextStyle({
        fontSize: 24,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        lineJoin: 'round',
    });

    private textScore: Text;

    private score = 0;

    constructor() {
        super();

        this.textScore = new Text(this.scoreString(), ScoreBoard.TEXT_STYLE);
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
