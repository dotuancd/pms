
<script lang="ts">
    import { type StrategyTypes, type Strategy as ResponseStrategy } from "$lib/Strategy";
	import RatesStrategy from "./RatesStrategy.svelte";
	import CountStrategy from "./CountStrategy.svelte";
	import StaticStrategyView from "./StaticStrategy.svelte";
    
    export let idPrefix = "strategy";
    // export let isNew: boolean = true;

    export let value: ResponseStrategy;

    let strategyType: StrategyTypes = value.type;

    const supportedStrategies: {value: StrategyTypes, label: string}[] = [
        { value: "forward", label: "Forward" },
        { value: "static", label: "Static" },
        { value: "rates", label: "Rates" },
        { value: "count", label: "Count" }
    ];

    function getStrategyByType(type: StrategyTypes): ResponseStrategy {
        switch (type) {
            case "forward":
                return {
                    type: "forward",
                };
            case "static":
                return {
                    type: "static",
                    options: {
                        status: 200,
                        body: "",
                        headers: []
                    }
                };
            case "rates":
                return {
                    type: "rates",
                    options: {
                        rates: []
                    }
                };
            case "count":
                return {
                    type: "count",
                    options: {
                        senarios: [],
                        fallback: {type: "forward"}
                    }
                };
        }
    }

    $: {
        // if (strategyType) {
        //     value = getStrategyByType(strategyType);
        // }
    }
    // $: value = isNew ? getStrategyByType(strategyType) : value;
</script>
<div class="flex flex-wrap gap-2 my-2">
    {#each supportedStrategies as supportStrategy}
        <div class="form-control">
            <label class="label cursor-pointer">
                <input type="radio" class="radio" name="{idPrefix}_strategy" bind:group={strategyType} on:click={() => value=getStrategyByType(supportStrategy.value)} value="{supportStrategy.value}">
                <span class="label-text ml-2">{supportStrategy.label}</span>
            </label>
        </div>
    {/each}
</div>

{#if (value.type === "forward") }
    <div class="my-3 bg-slate-50 rounded p-3 text-gray-500">
        This strategy will forward the request to the target server.
    </div>
{/if}

{#if value.type === "static"}
    <div class="my-3 bg-slate-50 rounded p-3 text-gray-500">
        The below options will be used to generate the response.
    </div>
    <StaticStrategyView bind:value={value} idPrefix="{idPrefix}_ss" />
{/if}

{#if value.type === "rates"}
    <div class="my-3 bg-slate-50 rounded p-3 text-gray-600">
        Define the rates that will be used to generate the response. <br/>
        <span class="font-bold text-gray-800 my-3">Example</span>
        <ul class="list-disc list-inside text-slate-900 dark:text-slate-200">
            <li>rate of 10% to return a 500 status code</li>
            <li>rate of 20% to return a 400 status code</li>
            <li>rate of 70% to forward the request</li>
        </ul>
    </div>
    <RatesStrategy bind:value={value} idPrefix="{idPrefix}_r" />
{/if}

{#if value.type === "count"}
    <div class="my-3 bg-slate-100 rounded p-3 text-gray-500">
        The return response will be based on the count of requests. <br />

        <span class="font-bold text-gray-800 my-3">Example</span>
        <ul class="list-disc list-inside text-slate-900 dark:text-slate-200">
            <li>first request to return a 400 status code</li>
            <li>the second request to return a 401 status code</li>
            <li>the third request to return a 500 status code</li>
            <li>otherwise the request will be forward to the target URL</li>
        </ul>
    </div>
    <CountStrategy bind:value={value} idPrefix="{idPrefix}_c" />
{/if}
