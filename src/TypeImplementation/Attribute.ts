import { AttributeType, IAttribute } from 'api-builder-types';

class Attribute implements IAttribute {
    DefaultValue: string | null;

    Identifier: string;

    IsMandatory: boolean;

    Name: string;

    Precision: number | null;

    Type: AttributeType;

    constructor(Identifier: string, IsMandatory: boolean, Name: string, Type: AttributeType,
        DefaultValue?: string, Precision?: number) {
        this.DefaultValue = DefaultValue;
        this.Identifier = Identifier;
        this.IsMandatory = IsMandatory;
        this.Name = Name;
        this.Precision = Precision;
        this.Type = Type;
    }
}

export default Attribute;
