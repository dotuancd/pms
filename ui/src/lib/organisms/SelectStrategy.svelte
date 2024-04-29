
<script lang="ts">
    import { type StrategyTypes } from "$lib/Strategy";
	import RatesStrategy from "./RatesStrategy.svelte";
	import CountStrategy from "./CountStrategy.svelte";
	import StaticStrategyView from "./StaticStrategy.svelte";
    
    export let strategyType: StrategyTypes = "forward";
    export let idPrefix = "strategy";
    export let isNew: boolean = true;

    export let value: any = {
        type: strategyType
    };

    function getStrategyByType(type: StrategyTypes) {
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

    $: value = isNew ? getStrategyByType(strategyType) : value;
</script>
<div class="flex flex-row gap-2 my-2">
    <div>
        <input type="radio" name="{idPrefix}" bind:group={strategyType} value="forward" id="{idPrefix}-forward">
        <label for="{idPrefix}-forward">Forward</label>
    </div>
    <div>
        <input type="radio" name="{idPrefix}" bind:group={strategyType} value="static" id="{idPrefix}-static">
        <label for="{idPrefix}-static">Static</label>
    </div>
    <div>
        <input type="radio" name="{idPrefix}" bind:group={strategyType} value="rates" id="{idPrefix}-rates">
        <label for="{idPrefix}-rates">Rates</label>
    </div>
    <div>
        <input type="radio" name="{idPrefix}" bind:group={strategyType} value="count" id="{idPrefix}-count">
        <label for="{idPrefix}-count">Count</label>
    </div>
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
