
import { Request, Response } from 'express';

export interface ResponseStrategy {
    buildResponse(req: Request, res: Response): Promise<Response>
}