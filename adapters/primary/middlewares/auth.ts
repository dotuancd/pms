import { Jwt } from "../../../application/shared/jwt"
import { AppDataSource } from "../../../src/data-source"
import { User } from "../../../src/entity/User"
import { Handler } from "express"

export const auth: Middleware

export default async function(req, res, next) {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const id = (await Jwt.decode(token)).id as number;
    
            const user = await AppDataSource.manager.getRepository(User).findOne({where: {id }})
            if (user) {
                req.user = user
                return next()
            } else {
                return res.status(401).send('Unauthorized')
            }
        } catch (error) {
            return res.status(401).send('Unauthorized')
        }
    }

    return res.status(401).send('Unauthorized')
}