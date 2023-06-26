import {DBFilter} from "../../types/db/DBFilter";

export interface DBClient {

    find<T>(from: string, query: Array<DBFilter>): Promise<Array<T>>

    update(from: string, query: object, newValues: object): Promise<void>;

    delete(from: string, query: object, newValues: object): Promise<void>;

    create<T extends object>(from: string, newEntity: T): Promise<T>

    initClient(): Promise<void>;

}