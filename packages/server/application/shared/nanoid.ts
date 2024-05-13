
import {  getRandomValues } from "crypto"

const vector = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"

export default function nanoid(length: number = 21): string {
    const bytes = getRandomValues(new Uint8Array(length))

    return Array.from(bytes)
    .map(i => vector[63 & i])
    .join("")
}