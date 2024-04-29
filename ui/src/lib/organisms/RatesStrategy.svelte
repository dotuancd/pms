
<script lang="ts">
	import type { RatesStrategy } from "$lib/Strategy";
	import DeleteIcon from "$lib/atoms/DeleteIcon.svelte";
	import SelectStrategy from "./SelectStrategy.svelte";

    export let value: RatesStrategy;
    export let idPrefix = "";

    function addRate() {
        value.options.rates.push({rate: 10, strategy: {type: "forward"}});

        value.options.rates = value.options.rates;
    }

    function totalRate() {
        return value.options.rates.reduce((acc, rate) => acc + rate.rate, 0);
    }
</script>
<div class="">
    {#each value.options.rates as rate, index}
        <div class="bg-slate-100 m-2 shadow-xl p-4 rounded-lg">
            <div class="flex flex-row justify-between">
                <div>
                    <label for="rate-{index}">Weight</label>
                    <input class="px-2 py-1 w-20" type="number" id="rate-{index}" bind:value={rate.rate} />
                    Rates:
                    <span class="ml-2 font-bold">{Math.round(rate.rate / totalRate() * 100)}%</span>
                </div>
                <div>
                    <button class="bg-red-400 font-medium px-2 py-1 rounded text-white hover:bg-red-600" type="button" on:click={() => value.options.rates = value.options.rates.filter((_, i) => i !== index)}>
                        <DeleteIcon size={18} />
                    </button>
                </div>
            </div>
            <div>
                <SelectStrategy bind:value={rate.strategy} idPrefix="{idPrefix}_{index}_s" />
            </div>
        </div>
    {/each}

    <div class="my-4 mx-2">
        <button class="bg-gray-100 border-2 border-gray-900 border-dashed font-medium px-2 py-1 rounded w-full hover:bg-gray-200" type="button" on:click={addRate}>
            + Add Rate
        </button>
    </div>
</div>
