import {DBClientMySQLImpl} from "../db/db_client/mysql/DBClientMySQLImpl";
import {DBClientMongoImpl} from "../db/db_client/mongo/DBClientMongoImpl";
import {appConfig} from "../index";
import {DBClient} from "../db/db_client/DBClient";
import PetSchemaModule from "../modules/PetSchemaModule";

const DB_TYPE_MAP: { [key: string]: { new(): DBClient } } = {
    mongo: DBClientMongoImpl,
    mysql: DBClientMySQLImpl,
}


// This method is only for the demo, generally pet schema will be created using the API
const initDogSchema = async () => {
    const petSchemaModel = new PetSchemaModule();
    const dogSchema = await petSchemaModel.findSchemaByType("dog");
    if (!dogSchema) {
        await petSchemaModel.createNewPetSchema({
            type: "dog",
            properties: {
                name: "string",
                age: "number",
                color: "string",
            }
        })
    }
}

export const initDB = async () => {
    if (!DB_TYPE_MAP[appConfig.dbType]) {
        throw new Error(`Missing db type (${appConfig})`)
    }

    appConfig.dbClient = new DB_TYPE_MAP[appConfig.dbType]();
    await appConfig.dbClient.initClient();
    await initDogSchema();

    console.log(`DB Initialized (${appConfig.dbType})`);
}