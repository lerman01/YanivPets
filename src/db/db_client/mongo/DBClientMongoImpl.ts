import {DBClient} from "../DBClient";
import {appConfig} from "../../../index";
import {Db, MongoClient} from "mongodb";
import {DBFilter} from "../../../types/db/DBFilter";

export class DBClientMongoImpl implements DBClient {

    private mongoClient: MongoClient;
    private mongoDatabase: Db = {} as Db;

    constructor() {
        this.mongoClient = new MongoClient(`mongodb://${appConfig.dbHost}:27017/pets`);
    }

    async create<T extends object>(from: string, newEntity: T): Promise<T> {
        await this.mongoDatabase.collection(from).insertOne(newEntity);
        return newEntity;
    }

    async delete(from: string, query: object, newValues: object): Promise<void> {
    }

    async find<T>(from: string, dbFilters: Array<DBFilter>): Promise<Array<T>> {
        const mongoQuery: any = {};
        for (const dbFilter of dbFilters) {
            mongoQuery[dbFilter.key] = this.convertDBFilterToMongoFilter(dbFilter)
        }

        return await this.mongoDatabase.collection<any>(from).find(mongoQuery).toArray() as T[];
    }

    async update(from: string, query: object, newValues: object): Promise<void> {
    }

    async initClient(): Promise<void> {
        await this.mongoClient.connect();
        this.mongoDatabase = this.mongoClient.db('pets');
    }

    private convertDBFilterToMongoFilter(dbFilter: DBFilter) {
        switch (dbFilter.operation) {
            case "EQ":
                return dbFilter.value
            case "NEQ":
                return {"$ne": dbFilter.value};
            case "GT":
                return {"$gt": dbFilter.value};
            case "LT":
                return {"$lt": dbFilter.value};
        }
    }

}