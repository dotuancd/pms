
import { Request, Response } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { ErrorStrategy } from './ErrorStrategy';
import { Site } from '../sites/site';
import { Writable } from "stream"

export class ForwardResponseStrategy implements ResponseStrategy {

    constructor(
        private errorStragegy: ErrorStrategy
    ) {}

    async build(req: Request, res: Response): Promise<Response> {

        const shouldReturnError = await this.errorStragegy.shouldReturnError(req);
        const site = new Site(req.params.site, 'name', 'url', true);

        if (shouldReturnError) {
            return this.errorStragegy.buildErrorResponse(site, req, res);
        }

        const url = req.originalUrl.replace(new RegExp(`/${site.key}/`), "");

        const headers = req.headers as Record<string, string>;
        // const headers = {};
        const forwardedResponse = await fetch(url, {
            method: req.method,
            headers,
            body: req.body,
            // @ts-ignore
            // verbose: true,
        })

        const blacklistHeaders: string[] = [
            // We rewrite encoding then if we forward heade. Client might not decode the encoding correctly
            'content-encoding',
            'content-length'
        ];
    
        const responseHeaders = [...forwardedResponse.headers]
        .filter(([key, value]) => {
            return ! blacklistHeaders.includes(key.toLowerCase())
        })
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        // const body = await forwardedResponse.arrayBuffer();
        console.log('Forwarded response headers:', responseHeaders);

        forwardedResponse.body?.pipeTo(Writable.toWeb(res));

        return res.status(forwardedResponse.status)
        .header(responseHeaders)
    }
}