import {
    IAttribute, IConstraint, ICoordinates, IEntity, IRelationship,
} from 'api-builder-types';

import Coordinates from './Coordinates';

class Entity implements IEntity {
    Attributes: IAttribute[];

    Constraints: IConstraint[];

    Coordinates: ICoordinates;

    Identifier: string;

    Name: string;

    PK: string[];

    Relationships: IRelationship[];

    constructor(Identifier: string, Name: string, XPos: number, YPos:number) {
        this.Identifier = Identifier;
        this.Name = Name;
        this.Coordinates = new Coordinates(XPos, YPos);
    }
}

export default Entity;
