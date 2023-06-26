import {PetSchema} from "../types/pets/PetSchema";

export const findInvalidPetProperty = (petSchema: PetSchema, pet: PetSchema): string | null => {
    if (pet.type !== petSchema.type) {
        return 'type';
    }

    const missingOrInvalidProperty = Object.entries(petSchema.properties).find(([schemaProperty, schemaValueType]) =>
        pet.properties[schemaProperty] === undefined || typeof pet.properties[schemaProperty] !== schemaValueType);

    if (missingOrInvalidProperty) {
        return missingOrInvalidProperty[0];
    }

    const unknownProperty = Object.keys(pet.properties).find(petProperty => petSchema.properties[petProperty] === undefined);

    if (unknownProperty) {
        return unknownProperty;
    }

    return null;
}
