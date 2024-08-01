import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Team } from "./entity/Team"
import { Rule } from "./entity/Rule"
import { Site } from "./entity/Site"
import { History } from "./entity/History"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Team, Rule, Site, History],
    migrations: [],
    subscribers: [],
})
