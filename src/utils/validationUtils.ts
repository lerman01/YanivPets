import {PetSchema} from "../types/pets/PetSchema";

export const findInvalidPetProperty = (petSchema: PetSchema, pet: PetSchema): string | null => {
    if (pet.type !== petSchema.type) {
        return 'type';
    }

    const missingOrInvalidProperty = Object.entries(petSchema.properties).find(([petProperty, propertyValue]) =>
        pet.properties[petProperty] === undefined || typeof pet.properties[petProperty] !== propertyValue);

    if (missingOrInvalidProperty) {
        return missingOrInvalidProperty[0];
    }

    return null;
}