import {IAttribute, IConstraint, ICoordinates, IEntity} from "../../../Api-Builder-Types";
import {IRelationship} from "../../../Api-Builder-Types/relationship";

class Entity implements IEntity{
    Attributes: IAttribute[];
    Constraints: IConstraint[];
    Coordinates: ICoordinates;
    Identifier: string;
    Name: string;
    PK: string[];
    Relationships: IRelationship[];
}
