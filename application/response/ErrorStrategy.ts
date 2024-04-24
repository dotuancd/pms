import { Request, Response } from "express";
import { Site } from "../sites/site";

export interface ErrorStrategy {
    shouldReturnError(req: Request): Promise<boolean>;

    buildErrorResponse(site: Site, req: Request, res: Response): Promise<Response>;
}