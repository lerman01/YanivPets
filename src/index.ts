import {AppConfig} from "./types/AppConfig";
import {initDB} from "./utils/dbUtils";

export let appConfig: AppConfig = {
    dbType: process.env.DB_TYPE,
    dbHost: process.env.DB_HOST
} as AppConfig;

const startApp = async () => {
    console.log('Init DB...')
    await initDB();

    const {initServer} = await import("./utils/serverUtils");

    console.log('Init Server...')
    await initServer();
}

startApp();