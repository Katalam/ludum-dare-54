export class Destination {
    private static destinations = [
        'BER',
        'LON',
        'PAR',
        'MAD',
        'ROM',
        'LIS',
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
            case 'BER':
                return 0x3399cc; // light blue
            case 'LON':
                return 0xcc3333; // light red
            case 'PAR':
                return 0x33cc33; // light green
            case 'MAD':
                return 0xcccc33; // light yellow
            case 'ROM':
                return 0xcc33cc; // light magenta
            case 'LIS':
                return 0x33cccc; // light cyan
            default:
                return 0x000000;
        }
    }

    public getName(): string {
        switch (this.destination) {
            case 'BER':
                return 'Berlin';
            case 'LON':
                return 'London';
            case 'PAR':
                return 'Paris';
            case 'MAD':
                return 'Madrid';
            case 'ROM':
                return 'Rome';
            case 'LIS':
                return 'Listbon';
            default:
                return '';
        }
    }
}
