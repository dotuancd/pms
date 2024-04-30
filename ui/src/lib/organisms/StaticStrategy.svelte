
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
    <div class="flex justify-between items-center">
        <div role="tablist" class="tabs tabs-boxed flex flex-row gap-4">
            <button role="tab" type="button" on:click={() => selected = "headers"} class="tab" class:tab-active={selected == "headers"}>
                Headers <span class="ml-1 badge badge-success badge-outline">{headersForEditor.length - 1}</span>
            </button>
            <button role="tab" type="button" on:click={() => selected = "body"} class="tab" class:tab-active={selected == "body"}>Body</button>
        </div>
        <div class="flex flex-row items-center">
            <label for="status">Status</label>
            <input class="input w-20 font-bold"
             class:text-success="{value.options.status < 300}" 
             class:text-warning="{value.options.status >= 300 && value.options.status < 400}"
             class:text-error="{value.options.status >= 400}" 
             min="100" max="599"
            type="number" id="status" bind:value="{value.options.status}" />
        </div>
    </div>
</div>

<div>
    {#if selected === "headers"}
        <div class="py-2">
            Headers
        </div>
        <table class="border rounded w-full">
            <tr class="text-left">
                <th class="border px-4 py-2">Key</th>
                <th class="border px-4 py-2" colspan="2">Value</th>
            </tr>
            {#each headersForEditor as header, index}
            <tr class="border">
                <td class="border p-2">
                    <!-- <input class="py-1 px-2 w-full rounded-none" type="text" on:input={() => addNewIfLastElement(index)} bind:value="{header.key}" placeholder="Key" /> -->
                    <input class="input w-full" type="text" id="{idPrefix}_{index}_hk" on:input={() => addNewIfLastElement(index)} bind:value="{header.key}" placeholder="Key" />
                </td>
                <td class="border border-r-0 p-2">
                    <!-- <input class="input input-bordered w-full" type="text" on:input={() => addNewIfLastElement(index)} bind:value="{header.key}" placeholder="Key" /> -->
                    <input class="input w-full" type="text" id="{idPrefix}_{index}_hv" on:input={() => addNewIfLastElement(index)} bind:value="{header.value}" placeholder="Value"  />
                    <!-- <input class="py-1 px-2 w-full rounded-none" type="text" on:input={() =>addNewIfLastElement(index)} bind:value="{header.value}" placeholder="Value" /> -->
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
            <!-- <div>
                <input bind:group={bodyType} type="radio" class="radio" name="{idPrefix}_body" value="none" id="{idPrefix}_body-none">
                <label for="{idPrefix}_body-none">none</label>

                
            </div> -->
            <div class="form-control">
                <label class="label cursor-pointer">
                    <input type="radio" bind:group={bodyType} name="{idPrefix}_body" value="none" class="radio "/>
                    <span class="label-text ml-2">none</span>
                </label>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <input type="radio" bind:group={bodyType} name="{idPrefix}_body" value="raw" class="radio "/>
                    <span class="label-text ml-2">raw</span>
                </label>
            </div>
            <!-- <div class="form-control">
                <label class="label cursor-pointer">
                    <input type="radio" bind:group={bodyType} name="radio-10" class="radio "/>
                    <span class="label-text ml-2">none</span>
                </label>
            </div> -->
            <!-- <div>
                <input bind:group={bodyType} type="radio" class="radio" name="{idPrefix}_body" on:click={() => addContentType("text")} value="raw" id="{idPrefix}_body-raw">
                <label for="{idPrefix}_body-raw">raw</label>
            </div> -->
            {#if bodyType === "raw"}
                <div>
                    <select class="select select-bordered rounded-box" bind:value={bodyRaw} on:change={(e) => addContentType(e.target?.value)} name="{idPrefix}_body_raw" id="{idPrefix}_body-raw_preset">
                        <option value="text">Text</option>
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                        <option value="xml">XML</option>
                    </select>
                </div>
            {/if}
        </div>
        {#if bodyType === "none"}
            <div class="bg-base-200 rounded-box py-4 text-gray-800 text-center text-sm">
                This response does not have a body
            </div>
        {/if}
        {#if bodyType === "raw"}
            <div>
                <textarea id="body" bind:value="{value.options.body}" class="textarea w-full min-h-24 textarea-bordered" />
            </div>
        {/if}
        
    {/if}
</div>
