import { Router } from "express";
import { Password } from "../../../application/shared/password";
import { Jwt } from "../../../application/shared/jwt";
import { AppDataSource } from "../../../src/data-source";
import { User } from "../../../src/entity/User";
import { z } from "zod"
import auth from "../middlewares/auth";

const router = Router();

router.post("/login", async (req, res) => {

    const result = z.object({
      email: z.string().min(1).email(),
      password: z.string().min(6),
    }).safeParse(req.body);
  
    if (! result.success) {
      return res.status(400).send(result.error);
    }
  
    const {email, password} = result.data;
  
    const user = await AppDataSource.manager.getRepository(User)
    .createQueryBuilder()
    .addSelect('User.password')
    .where({email})
    .getOne();
  
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }
  
    if (!Password.verify(password, user.password)) {
      return res.status(401).send("Invalid email or password");
    }
  
    delete user.password
    const token = await Jwt.encode({id: user.id})
    res.cookie("AUTH", token, {httpOnly: true, sameSite: process.env.AUTH_COOKIE_SAME_SITE as any, secure: process.env.AUTH_COOKIE_SECURE === "true"});
    return res.send({
      ...user,
      token
    });
    // return jwt
  })

router.post("/logout", (req, res) => {
    res.clearCookie("AUTH");
    res.send("Logged out");
})

router.get("/me", auth, async (req, res) => {
    // @ts-ignore
    const user = req.user;
    delete user.password;
    return res.send(user);
})

router.post("/register", (req, res) => {
    const user = z.object({
        name: z.string().min(1),
        email: z.string().min(1).email(),
        password: z.string().min(6),
    }).parse(req.body);

    user.password = Password.make(user.password);

    AppDataSource.manager.getRepository(User).save(user);

    res.send("User created");
})

export default router;