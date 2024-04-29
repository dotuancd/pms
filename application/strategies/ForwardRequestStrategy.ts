
import { Request, Response } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { Site } from '../sites/site';
import { Writable } from "stream"

export class ForwardRequestStrategy implements ResponseStrategy {

    async build(req: Request, res: Response): Promise<Response> {

        const site = new Site(req.params.siteKey, 'name', 'url', true);

        const url = req.originalUrl.replace(new RegExp(`/p/${site.key}/`), "");

        const headers = req.headers as Record<string, string>;
        // const headers = {};
        try {

            // if (["HEAD", "GET"].includes(req.method.toUpperCase()) &) {
            //     return res.status(400).send('Body not allowed for GET and HEAD requests');
            // }

            const body = ["HEAD", "GET"].includes(req.method.toUpperCase()) ? {} : {body: (req.body || null)}

            const forwardedResponse = await fetch(url, {
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
    
            // const body = await forwardedResponse.arrayBuffer();
            console.log('Forwarded response headers:', responseHeaders);
    
            forwardedResponse.body?.pipeTo(Writable.toWeb(res));
    
            return res.status(forwardedResponse.status)
            .header(responseHeaders)
        } catch (error) {
            console.error('Error forwarding request:', error);
            return res.status(500).send(`Error forwarding request: ${error}`);
        }
        
    }
}