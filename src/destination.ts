export class Destination {
    private static destinations = [
        'NY',
        'LA',
        'SF',
        'OH',
        'TX',
        'FL',
        'NC',
    ];

    static getRandomDestination(): Destination {
        const destination = this.destinations[Math.floor(Math.random() * this.destinations.length)] as string;

        return new this(destination);
    }

    public destination: string = '';

    constructor(destination: string) {
        this.destination = destination;
    }

    public getColor(): number {
        switch (this.destination) {
            case 'NY':
                return 0x009933;
            case 'LA':
                return 0x00cc99;
            case 'SF':
                return 0x0066ff;
            case 'OH':
                return 0xcc33ff;
            case 'TX':
                return 0xff0066;
            case 'FL':
                return 0xff9933;
            case 'NC':
                return 0xccff33;
            default:
                return 0xffffff;
        }
    }

    public getName(): string {
        switch (this.destination) {
            case 'NY':
                return 'New York';
            case 'LA':
                return 'Los Angeles';
            case 'SF':
                return 'San Francisco';
            case 'OH':
                return 'Ohio';
            case 'TX':
                return 'Texas';
            case 'FL':
                return 'Florida';
            case 'NC':
                return 'North Carolina';
            default:
                return '';
        }
    }
}
