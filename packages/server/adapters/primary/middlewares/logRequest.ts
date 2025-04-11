import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../../src/data-source";
import { Site } from "../../../src/entity/Site";
import { History } from "../../../src/entity/History";
import { getTargetUrl } from "../../../application/shared";
export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", async () => {
    const site = await AppDataSource.manager.getRepository(Site).findOne({
      where: {
        id: req.params.siteKey,
      },
    });

    const history = new History();
    history.request = {
      method: req.method,
      url: getTargetUrl(req).href,
      body: req.body,
    };
    history.responseStatusCode = res.statusCode;
    history.site = site;
    
    await AppDataSource.manager.getRepository(History).insert(history);
  });

  next();
}
