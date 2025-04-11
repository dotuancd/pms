import { History } from './../../../src/entity/History';
import { Router } from "express";
import auth from "../middlewares/auth";
import { AppDataSource } from '../../../src/data-source';

const router = Router();
router.get('/:siteId', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  const [history, total] = await AppDataSource.manager.getRepository(History).findAndCount({
    where: {
      site: {
        id: req.params.siteId
      },
    },
    order: {
      createdAt: "DESC",
    },
    skip,
    take: limit,
  });

  res.send({
    data: history,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
})

export default router;