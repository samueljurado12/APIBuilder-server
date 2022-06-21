import DBProject from "../entity/DBProject";
import ValidationMessage from "./ValidationMessage";
import DBEntity from "../entity/DBEntity";
import DBAttribute from "../entity/DBAttribute";

class ProjectValidator {
    static validate(project: DBProject) : ValidationMessage {
        let result: ValidationMessage = new ValidationMessage();

        result = this.ValidateRelationShips(result, project.entities);

        return result;
    }

    private static ValidateRelationShips(validation: ValidationMessage, entities: DBEntity[]) {
        let entitiesWithRelationships = entities.filter(e => e.relationships.length > 0);
        let result: ValidationMessage = validation;
        entitiesWithRelationships.forEach(e => {
            e.relationships.forEach(r => {
                const rightSide = entities.find(e => e.id === r.rightSide);
                let errorMessage: string[] = [];
                if(rightSide === undefined)
                    errorMessage.push(`Entity: ${e.name} MissingRightSide. Right side entity does no exist.`);
                else {
                    const primaryKeys: DBAttribute[] = rightSide.attributes.filter(a => a.primaryKeyInd);
                    primaryKeys.forEach(pk => {
                        if(e.attributes.filter(a =>
                            a.name.toLowerCase() === `${rightSide.name}${pk.name}`.toLowerCase()).length === 0)
                            errorMessage.push(`Entity: ${e.name} MissingForeignKey. This entity must have one attribute called ${rightSide.name}${pk.name}`);
                    })
                }
                if(errorMessage.length>0) {
                    result.isOk = false;
                    result.errorMessages = result.errorMessages.concat(errorMessage);
                }
            })
        })

        return result;
    }
}

export default ProjectValidator
