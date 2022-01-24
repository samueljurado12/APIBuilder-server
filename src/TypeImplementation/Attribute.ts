import {AttributeType, IAttribute} from "../../../Api-Builder-Types";

class Attribute implements IAttribute{
    DefaultValue: string | null;
    Identifier: string;
    IsMandatory: boolean;
    Name: string;
    Precision: number | null;
    Type: AttributeType;
}
