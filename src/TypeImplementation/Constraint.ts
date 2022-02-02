import { IConstraint, ConstraintType } from 'api-builder-types';

class Constraint implements IConstraint {
    Attributes: string[];

    Identifier: string;

    Type: ConstraintType;

    constructor(Attributes: string[], Identifier: string, Type: ConstraintType) {
        this.Attributes = Attributes;
        this.Identifier = Identifier;
        this.Type = Type;
    }
}

export default Constraint;
