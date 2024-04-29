// place files you want to import through the `$lib` alias in this folder.

export function styleForMethod(method: string) {
    switch (method) {
        case "GET":
        case "HEAD":
            return "text-green-700";
        case "POST":
            return "text-yellow-700";
        case "PUT":
            return "text-blue-700";
        case "DELETE":
            return "text-red-700";
        case "PATCH":
            return "text-purple-700";
        case "OPTIONS":
            return "text-pink-700";
        default:
            return "text-green-700";
    }
}