// place files you want to import through the `$lib` alias in this folder.

export function styleForMethod(method: string) {
    switch (method) {
        case "GET":
        case "HEAD":
            return "text-primary";
        case "POST":
            return "text-secondary";
        case "PUT":
            return "text-accent";
        case "DELETE":
            return "text-error";
        case "PATCH":
            return "text-info";
        case "OPTIONS":
            return "text-warning";
        default:
            return "text-green-700";
    }
}