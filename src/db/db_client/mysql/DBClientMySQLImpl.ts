import {DBClient} from "../DBClient";
import {QueryTypes, Sequelize} from "sequelize";
import {appConfig} from "../../../index";
import {DBFilter} from "../../../types/db/DBFilter";

export class DBClientMySQLImpl implements DBClient {
    private sequelize: Sequelize = {} as Sequelize;

    async create<T extends object>(from: string, newEntity: T): Promise<T> {
        const query = `INSERT INTO pets.${from} ${this.convertEntityToColumnNames(newEntity)}
        VALUES ${this.convertEntityToColumnValues(newEntity)}`
        const [newEntityId] = await this.sequelize.query(query, {type: QueryTypes.INSERT, raw: true});
        return {
            _id: newEntityId,
            ...newEntity
        };
    }

    delete(from: string, query: object, newValues: object): Promise<void> {
        return Promise.resolve(undefined);
    }

    async find<T>(from: string, dbFilters: Array<DBFilter>): Promise<Array<T>> {
        let query = `SELECT *
                     FROM pets.${from}`;
        if (dbFilters.length) {
            query += ' WHERE '
            for (let i = 0; i < dbFilters.length; i++) {
                query += this.convertDBFilterToMySQLFilter(dbFilters[i]);
                if (i < dbFilters.length - 1) {
                    query += ' AND ';
                }
            }
        }
        return await this.sequelize.query(query, {type: QueryTypes.SELECT, raw: true}) as unknown as Array<T>;
    }

    update(from: string, query: object, newValues: object): Promise<void> {
        return Promise.resolve(undefined);
    }

    async initClient(): Promise<void> {
        this.sequelize = new Sequelize({
            host: appConfig.dbHost,
            username: 'root',
            dialect: "mariadb"
        });
        await this.sequelize.authenticate();
        await this.sequelize.query('CREATE DATABASE IF NOT EXISTS pets');
        await this.sequelize.query(`CREATE TABLE IF NOT EXISTS pets.pet_schema
                                    (
                                        type       varchar(255) PRIMARY KEY,
                                        properties JSON
                                    )`);
        await this.sequelize.query(`CREATE TABLE IF NOT EXISTS pets.pet_data
                                    (
                                        _id        int AUTO_INCREMENT PRIMARY KEY ,
                                        type       varchar(255),
                                        properties JSON
                                    )`);
    }

    private convertDBFilterToMySQLFilter(dbFilter: DBFilter) {
        let keyQuery;
        const keyArray = dbFilter.key.split('.')
        if (keyArray.length > 1) {
            keyQuery = `${keyArray.shift()}->>`;
            keyQuery+= `'$.${keyArray.join('.')}'`
        } else {
            keyQuery = dbFilter.key;
        }

        switch (dbFilter.operation) {
            case "EQ":
                return `${keyQuery} = '${dbFilter.value}'`
            case "NEQ":
                return `${keyQuery} <> '${dbFilter.value}'`
            case "GT":
                return `${keyQuery} > '${dbFilter.value}'`
            case "LT":
                return `${keyQuery} < '${dbFilter.value}'`
        }
    }

    private convertEntityToColumnNames(obj: object) {
        return `(${Object.keys(obj).join(', ')})`;
    }

    private convertEntityToColumnValues(obj: object) {
        return `(${Object.values(obj).map(value => typeof value === 'object' ? `'${JSON.stringify(value)}'` : `'${value}'`).join(', ')})`;
    }

}