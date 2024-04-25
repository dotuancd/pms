import { Request, Response } from "express";


export interface ResponseStrategy {
    build(req: Request, res: Response): Promise<Response>
}