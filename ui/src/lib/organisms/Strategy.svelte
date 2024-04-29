
<script lang="ts">
    import type { Strategy } from "$lib/Strategy";
	import RatesStrategy from "./RatesStrategy.svelte";
	import StaticStrategy from "./StaticStrategy.svelte";

    export let value: Strategy;
</script>

{#if value.type == "forward"}
    <div>
        <h2>Forward</h2>
        <p>Forward to another URL</p>
    </div>
{/if}

{#if value.type == "static"}
    <StaticStrategy {value} />
{/if}

{#if value.type == "count"}
    <div>
        <h2>Count</h2>
        <p>Count the number of requests</p>
    </div>
{/if}

{#if value.type == "rates"}
    <RatesStrategy {value} />
{/if}