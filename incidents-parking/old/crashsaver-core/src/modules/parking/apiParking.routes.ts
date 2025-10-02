import { Request, RequestHandler, Response } from 'express';
import {  Options, createProxyMiddleware } from 'http-proxy-middleware';
import apicache from 'apicache';

export class ParkingRoutes {
    private apiPath: string;
    private url = process.env.PARKING_LOT as string;

    constructor(apiPath: string) {
        this.apiPath = apiPath;
    }

    public createParkingProxyMiddleware(): RequestHandler  {
        const proxyOptions: Options = {
            target: this.url,
            changeOrigin: true,
            pathRewrite: (path: string, req: Request) => {
                apicache.options({
                    appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
                });
                const newPath = path.replace(this.apiPath, '/');
                // console.log(`Proxy Path: ${newPath}`);
                // console.log(`Request Body: ${JSON.stringify(req.body)}`);
                return newPath;
            },
            onProxyReq: (proxyReq, req: Request, res: Response) => {
                // Extraer _id de req.body.clientData y establecerlo como X-User-Id en el header
                // const clientData = req.body.clientData as DtoToken;
                const clientData = req.body.clientData;
                const lang = req.headers['lang'] || '';
                if (clientData && clientData._id) {
                    const userId = clientData.id;
                    proxyReq.setHeader('X-User-Id', userId);
                    proxyReq.setHeader('lang', lang);
                }
                if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
        }
        return createProxyMiddleware(proxyOptions)
    }
}
