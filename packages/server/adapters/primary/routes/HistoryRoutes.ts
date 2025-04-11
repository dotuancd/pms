import { History } from './../../../src/entity/History';
import { Router } from "express";
import auth from "../middlewares/auth";
import { AppDataSource } from '../../../src/data-source';

const router = Router();
router.get('/:siteId', async (req, res) => {
  const history = await AppDataSource.manager.getRepository(History).find({
    where: {
      site: {
        id: req.params.siteId
      },
    },
    order: {
      createdAt: "DESC",
    },
  })

  res.send(history);
})

export default router;