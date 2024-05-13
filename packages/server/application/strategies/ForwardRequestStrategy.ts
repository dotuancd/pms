
import { Request, Response, request } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { Writable } from "stream"
import { getTargetUrl } from '../shared';
import { Resign } from './Resign';

export class ForwardRequestStrategy implements ResponseStrategy {

    public constructor(private readonly resigner?: Resign) {}

    async build(req: Request, res: Response): Promise<Response> {
        const url = getTargetUrl(req);

        const headers = req.headers as Record<string, string>;

        // Remove content-length header to prevent mismatch between actual body and content-length
        delete headers['content-length'];

        const targetUrl = this.resigner ? this.resigner.resign(url, req.method) : url;
        try {

            // if (["HEAD", "GET"].includes(req.method.toUpperCase()) &) {
            //     return res.status(400).send('Body not allowed for GET and HEAD requests');
            // }

            const body = ["HEAD", "GET"].includes(req.method.toUpperCase()) ? {} : {body: req.body}

            const forwardedResponse = await fetch(targetUrl, {
                method: req.method,
                headers,
                ...body
                // NodeJS not support body for GET and HEAD requests
                
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
    
            forwardedResponse.body?.pipeTo(Writable.toWeb(res));
    
            return res.status(forwardedResponse.status)
            .header(responseHeaders)
        } catch (error) {
            console.error('Error forwarding request:', error);
            return res.status(500).send(`Error forwarding request: ${error}`);
        }
        
    }
}