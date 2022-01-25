import { IRelationship } from 'api-builder-types';
import RightImp from './RightImp';

class Relationship implements IRelationship {
    Identifier: string;

    RightSide: RightImp;

    constructor(Identifier: string, Entity: string, PrimaryKeyReferenced: string) {
        this.Identifier = Identifier;
        this.RightSide = new RightImp(Entity, PrimaryKeyReferenced);
    }
}

export default Relationship;
