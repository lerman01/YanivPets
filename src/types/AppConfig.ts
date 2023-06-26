import {DBClient} from "../db/db_client/DBClient";

export type AppConfig = {
    dbType: string;
    dbHost: string;
    dbClient: DBClient;
}