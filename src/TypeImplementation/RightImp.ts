import { Right, Multiplicity } from 'api-builder-types';

class RightImp implements Right {
    Entity: string;

    Multiplicity: Multiplicity;

    PrimaryKeyReferenced: string;

    constructor(Entity: string, PrimaryKeyReferenced: string) {
        this.Entity = Entity;
        this.PrimaryKeyReferenced = PrimaryKeyReferenced;
    }
}

export default RightImp;
