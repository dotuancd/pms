
export type Method = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "PATCH" | "DELETE" | string

export interface Resign {
    resign(url: URL, method: Method): URL;
}