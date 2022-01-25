import { IConstraint } from 'api-builder-types';
import { ConstraintType } from 'api-builder-types/constraint';

class Constraint implements IConstraint {
    Attributes: number[];

    Identifier: string;

    Type: ConstraintType;
}

export default Constraint;
