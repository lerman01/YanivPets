import PetModel from "../db/models/PetModel";
import {appConfig} from "../index";
import {PetSchema} from "../types/pets/PetSchema";
import {BadRequestError} from "../types/http/BadRequestError";
import PetSchemaModule from "./PetSchemaModule";
import {findInvalidPetProperty} from "../utils/validationUtils";
import {DBFilter} from "../types/db/DBFilter";

export default class PetModule {

    private petModel: PetModel;
    private petSchemaModule: PetSchemaModule;

    constructor() {
        this.petModel = new PetModel(appConfig.dbClient);
        this.petSchemaModule = new PetSchemaModule();
    }

    async findPets(query: Array<DBFilter>): Promise<Array<PetSchema>> {
        return await this.petModel.findPets(query)
    }

    deletePet(): PetSchema {
        return null as any;
    }

    updatePet(): PetSchema {
        return null as any;
    }

    async createNewPet(newPetRequest: PetSchema): Promise<PetSchema> {
        //TODO: should check if inner id already exist ?
        const petSchema = await this.petSchemaModule.findSchemaByType(newPetRequest.type);
        if (!petSchema) {
            throw new BadRequestError(`Pet schema not exist for type: ${newPetRequest.type}`);
        }

        const invalidProperty = findInvalidPetProperty(petSchema, newPetRequest);

        if (invalidProperty) {
            throw new BadRequestError(`Missing or invalid pet property: ${invalidProperty}`);
        }

        return await this.petModel.createNewPet(newPetRequest);
    }
}
