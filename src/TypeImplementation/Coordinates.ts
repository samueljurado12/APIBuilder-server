import { ICoordinates } from 'api-builder-types';

class Coordinates implements ICoordinates {
    X: number;

    Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}

export default Coordinates;
