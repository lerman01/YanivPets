import {appConfig} from "../index";
import PetSchemaModel from "../db/models/PetSchemaModel";
import {PetSchema} from "../types/pets/PetSchema";

export default class PetSchemaModule {

    private petSchemaModel: PetSchemaModel;

    constructor() {
        this.petSchemaModel = new PetSchemaModel(appConfig.dbClient)
    }

    async findSchemaByType(type: string): Promise<PetSchema | undefined> {
        const petSchemas = await this.petSchemaModel.findSchemaByType(type);
        if (petSchemas.length > 1) {
            console.error(`More then 1 schema exist for type: ${type}`);
        }
        return petSchemas[0];
    }

    async createNewPetSchema(newPetSchema: PetSchema) {
        //TODO: Validate if pet schema exists
        await this.petSchemaModel.createNewPetSchema(newPetSchema)
    }

}