
import { randomBytes } from "crypto";
import { base64url } from "jose";

async function run() {

    const isPlain = process.argv.includes("--plain");

    const log = isPlain ? () => {} : console.log;
    const logKey = console.log;

    log("Generating a new key...");
    
    const key = base64url.encode(randomBytes(32));

    log("Key generated!");
    logKey(key)
}

run();