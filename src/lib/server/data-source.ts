import "reflect-metadata"
import { DataSource } from "typeorm"
import { Site } from "./entity/Site"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Site],
    migrations: [],
    subscribers: [],
})
