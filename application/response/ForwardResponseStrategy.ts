
import { Request, Response } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { ErrorStrategy } from './ErrorStrategy';
import { Site } from '../sites/site';
import { Writable } from "stream"

export class ForwardResponseStrategy implements ResponseStrategy {

    constructor(
        private errorStragegy: ErrorStrategy
    ) {}

    async buildResponse(req: Request, res: Response): Promise<Response> {

        const shouldReturnError = await this.errorStragegy.shouldReturnError(req);
        const site = new Site('key', 'name', 'url', true);

        if (shouldReturnError) {
            return this.errorStragegy.buildErrorResponse(site, req, res);
        }

        const url = req.params[0];
        const headers = req.headers as Record<string, string>;
        const forwardedResponse = await fetch(url, {
            method: req.method,
            headers,
            body: req.body,
            // @ts-ignore
            // verbose: true,
        })
    
        const responseHeaders = [...forwardedResponse.headers]
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        // const body = await forwardedResponse.arrayBuffer();
        console.log('Forwarded response headers:', responseHeaders);

        const stream = forwardedResponse.body!;

        stream.pipeTo(Writable.toWeb(res));

        return res.status(forwardedResponse.status)
        .header(responseHeaders)
        // .send(forwardedResponse.body);
    }
}