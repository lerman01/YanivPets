import {Model} from "./Model";
import {PetSchema} from "../../types/pets/PetSchema";
import {DBClient} from "../db_client/DBClient";

export default class PetSchemaModel extends Model {

    constructor(dbClient: DBClient) {
        super(dbClient);
        this.storageName = "pet_schema"
    }

    async findSchemaByType(type: string): Promise<Array<PetSchema>> {
        return await this.dbClient.find<PetSchema>(this.storageName, [{
            key: "type",
            operation: "EQ",
            value: type
        }]);
    }

    async createNewPetSchema(newPetSchema: PetSchema) {
        return await this.dbClient.create<PetSchema>(this.storageName, newPetSchema);
    }

}