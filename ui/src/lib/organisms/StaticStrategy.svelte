
<script lang="ts">
	import type { StaticStrategy, Strategy } from "$lib/Strategy";
	import DeleteIcon from "$lib/atoms/DeleteIcon.svelte";

    export let value: StaticStrategy;
    export let idPrefix = "";
    let selected = "headers";
    let bodyType = value.options.body ? "raw" : "none";
    let bodyRaw = "text";

    let headersForEditor: {key: string, value: string}[] = [];

    let contentTypes = new Map([
        ["text", "text/plain"],
        ["json", "application/json"],
        ["html", "text/html"],
        ["xml", "application/xml"]
    ])
    
    headersForEditor = value.options.headers.map(header => {
        return {
            key: header.key,
            value: header.value
        }
    });

    headersForEditor.push({key: "", value: ""})

    function addNewIfLastElement(index: number) {
        if (index == headersForEditor.length - 1) {
            headersForEditor.push({key: "", value: ""});
        }
    }

    function deleteHeader(index: number) {
        headersForEditor = headersForEditor.filter((_, i) => i !== index);
    }

    function addContentType(bodyType: string) {
        headersForEditor = [
                {key: "Content-Type", value: contentTypes.get(bodyType) || "text/plain"},
                ...headersForEditor.filter(header => header.key.toLowerCase() !== "content-type")
            ];
    }

    $: {
        if (bodyType === "none") {
            value.options.body = null;
        }

        value.options.headers = headersForEditor.filter(header => header.key !== "");
    }
</script>

<div>
    <div class="flex justify-between border-b py-2">
        <ul class="flex flex-row gap-4" role="tablist">
            <li class="border-orange-500" role="tab" class:border-b-2={selected == "headers"} >
                <button type="button" on:click={() => selected = "headers"}>
                    Headers <span class="text-sm text-green-700">({headersForEditor.length - 1})</span>
                </button>
            </li>
            <li class="border-orange-500" role="tab" class:border-b-2={selected == "body"}><button type="button" on:click={() => selected = "body"}>Body</button></li>
        </ul>
        <div>
            <label for="status">Status</label>
            <input class="px-2 py-1 rounded w-20 font-bold"
             class:text-green-600="{value.options.status < 300}" 
             class:text-orange-600="{value.options.status >= 300 && value.options.status < 400}" 
             class:text-red-600="{value.options.status >= 400}" 
             min="100" max="599"
            type="text" id="status" bind:value="{value.options.status}" />
        </div>
    </div>
</div>

<div>
    {#if selected === "headers"}
        <div class="py-2">
            Headers
        </div>
        <table class="bg-white border rounded w-full">
            <tr class="text-left">
                <th class="border px-4 py-2">Key</th>
                <th class="border px-4 py-2" colspan="2">Value</th>
            </tr>
            {#each headersForEditor as header, index}
            <tr class="border">
                <td class="border p-2">
                    <input class="py-1 px-2 w-full rounded-none" type="text" on:input={() => addNewIfLastElement(index)} bind:value="{header.key}" placeholder="Key" />
                </td>
                <td class="border border-r-0 p-2">
                    <input class="py-1 px-2 w-full rounded-none" type="text" on:input={() =>addNewIfLastElement(index)} bind:value="{header.value}" placeholder="Value" />
                </td>
                <td class="w-10 p-2 text-end">
                    {#if index < headersForEditor.length - 1}
                        <button type="button" class="p-1 rounded hover:bg-slate-100" on:click={() => deleteHeader(index)} >
                            <DeleteIcon class="text-sm" size="{24}"/>
                        </button>
                    {/if}
                </td>
            </tr>
            {/each}
        </table>
    {/if}
    {#if selected === "body"}
        <div class="my-2 flex flex-row content-between gap-2">
            <div>
                <input bind:group={bodyType} type="radio" name="{idPrefix}_body" value="none" id="{idPrefix}_body-none">
                <label for="{idPrefix}_body-none">none</label>
            </div>
            <div>
                <input bind:group={bodyType} type="radio" name="{idPrefix}_body" on:click={() => addContentType("text")} value="raw" id="{idPrefix}_body-raw">
                <label for="{idPrefix}_body-raw">raw</label>
            </div>
            {#if bodyType === "raw"}
                <div>
                    <select class="border rounded px-2 py-1" bind:value={bodyRaw} on:change={(e) => addContentType(e.target?.value)} name="{idPrefix}_body_raw" id="{idPrefix}_body-raw_preset">
                        <option value="text">Text</option>
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                        <option value="xml">XML</option>
                    </select>
                </div>
            {/if}
        </div>
        {#if bodyType === "none"}
            <div class="text-gray-800 text-center text-sm">
                This response does not have a body
            </div>
        {/if}
        {#if bodyType === "raw"}
            <div>
                <textarea id="body" bind:value="{value.options.body}" class="p-2 w-full border rounded" />
            </div>
        {/if}
        
    {/if}
</div>
