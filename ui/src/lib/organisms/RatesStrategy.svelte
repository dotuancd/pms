
<script lang="ts">
	import type { RatesStrategy } from "$lib/Strategy";
	import DeleteIcon from "$lib/atoms/DeleteIcon.svelte";
	import SelectStrategy from "./SelectStrategy.svelte";

    export let value: RatesStrategy;
    export let idPrefix = "";

    value.options.rates.push({rate: 10, strategy: {type: "forward"}});

    function addRate() {
        // value.options.rates.push({rate: 10, strategy: {type: "forward"}});
        value.options.rates = [
            ...value.options.rates,
            {rate: 10, strategy: {type: "forward"}}
        ];
    }

    function totalRate() {
        return value.options.rates.reduce((acc, rate) => acc + rate.rate, 0);
    }
</script>
<div class="">
    {#each value.options.rates as rate, index}
        <div class="bg-slate-100 m-2 shadow-xl p-4 rounded-lg">
            <div class="flex flex-row justify-between">
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text ml-2">Weight</span>
                        <input class="px-2 py-1 w-20" type="number" id="{idPrefix}-rate-{index}" bind:value={rate.rate} />
                    </label>
                    
                    Rates:
                    <span class="ml-2 font-bold">{Math.round(rate.rate / totalRate() * 100)}%</span>
                </div>
                <div>
                    <button class="btn btn-error btn-ghost text-error" type="button" on:click={() => value.options.rates = value.options.rates.filter((_, i) => i !== index)}>
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
        <button class="btn btn-secondary btn-block btn-sm border-dashed border-box btn-outline border-2" type="button" on:click={addRate}>
            + Add Rate
        </button>
    </div>
</div>
