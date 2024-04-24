import { Request, Response } from "express";
import { Site } from "../sites/site";
import { ErrorStrategy } from "./ErrorStrategy";

export class ErrorRateErrorStrategy implements ErrorStrategy {

    constructor(
        private errorRate: number
    ) {}

    async shouldReturnError(request: Request): Promise<boolean> {
        return Math.random() < this.errorRate;
    }

    async buildErrorResponse(site: Site, request: Request, res: Response): Promise<Response> {

        return res.status(500).json({
            "error": true,
            "message": "Random error occurred"
        });
    }

}