import {Model} from "./Model";
import {PetSchema} from "../../types/pets/PetSchema";
import {DBFilter} from "../../types/db/DBFilter";
import {DBClient} from "../db_client/DBClient";

export default class PetModel extends Model {

    constructor(dbClient: DBClient) {
        super(dbClient);
        this.storageName = "pet_data"
    }

    async createNewPet(pet: PetSchema): Promise<PetSchema> {
        return await this.dbClient.create(this.storageName, pet);
    }

    async findPets(filters: Array<DBFilter>): Promise<Array<PetSchema>> {
        return await this.dbClient.find(this.storageName, filters);
    }

}