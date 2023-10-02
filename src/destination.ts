export class Destination {

    public static readonly BER = new Destination('BER');
    public static readonly LON = new Destination('LON');
    public static readonly PAR = new Destination('PAR');
    public static readonly MAD = new Destination('MAD');
    public static readonly ROM = new Destination('ROM');
    public static readonly LIS = new Destination('LIS');
    public static readonly VIE = new Destination('VIE');
    public static readonly PRA = new Destination('PRA');

    private static destinations = [Destination.BER, Destination.LON, Destination.PAR, Destination.MAD, Destination.ROM, Destination.LIS, Destination.VIE, Destination.PRA];

    public static getRandomDestination(limit: number = this.destinations.length): Destination {
        if (limit <= 0 || limit > this.destinations.length) {
            throw new RangeError();
        }

        return this.destinations[Math.floor(Math.random() * limit)]!;
    }

    public static getDestinationByIndex(index: number): Destination {
        if (index < 0 || index >= this.destinations.length) {
            throw new RangeError();
        }

        return this.destinations[index]!;
    }

    public destination: string;

    private constructor(destination: string) {
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
                return 0xcc3390; // light magenta
            case 'LIS':
                return 0x33cccc; // light cyan
            case 'VIE':
                return 0xff8c00; // orange
            case 'PRA':
                return 0x9d33cc; // purple
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
                return 'Lisbon';
            case 'VIE':
                return 'Vienna';
            case 'PRA':
                return 'Prague';
            default:
                return '';
        }
    }
}
