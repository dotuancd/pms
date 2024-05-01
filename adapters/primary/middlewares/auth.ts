import { Jwt } from "../../../application/shared/jwt"
import { AppDataSource } from "../../../src/data-source"
import { User } from "../../../src/entity/User"

export default async function auth(req, res, next) {
    try {
        let token: string;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            token = req.cookies["AUTH"]
        }

        const id = (await Jwt.decode(token)).id as number;

        const user = await AppDataSource.manager.getRepository(User).findOne({where: {id }})
        if (user) {
            req.user = user
            return next()
        } else {
            return res.status(401).send('Unauthorized')
        }
    } catch (error) {
        console.error(error)
        return res.status(401).send('Unauthorized')
    }
}