
import { Request } from "express"

export function getTargetUrl(request: Request) {
    return new URL(request.originalUrl.replace(new RegExp(`/(.*?)/`), ""))
}