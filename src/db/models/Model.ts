import {DBClient} from "../db_client/DBClient";

export abstract class Model {

    protected dbClient: DBClient;
    protected storageName: string = "";

    constructor(dbClient: DBClient) {
        this.dbClient = dbClient
    }
}