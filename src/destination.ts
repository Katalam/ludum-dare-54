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
                return 0x00ff00;
            case 'LA':
                return 0xff0000;
            case 'SF':
                return 0x0000ff;
            case 'OH':
                return 0xffff00;
            case 'TX':
                return 0x00ffff;
            case 'FL':
                return 0xff00ff;
            case 'NC':
                return 0x000000;
            default:
                return 0x000000;
        }
    }

    public getDestinationLong(): string {
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
