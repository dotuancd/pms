
<script lang="ts">
	import type { CountStrategy } from "$lib/Strategy";
	import DeleteIcon from "$lib/atoms/DeleteIcon.svelte";
	import SelectStrategy from "./SelectStrategy.svelte";

    export let value: CountStrategy;
    export let idPrefix = "";

    const operations = ["<", ">", "<=", ">=", "==", "!="];

    function newSenario() {
        const maxCount = value.options.senarios.reduce((max, count) => Math.max(max, count.value), 1);

        value.options.senarios.push({value: maxCount + 1, operator: "<", strategy: {type: "forward"}});

        value.options.senarios = value.options.senarios;
    }

    function deleteSenario(index: number) {
        value.options.senarios = value.options.senarios.filter((_, i) => i !== index);
    }
</script>
<div class="">
    <div>
        <h3 class="text-lg font-bold text-gray-800">Fallback strategy</h3>
        <p class="my-3">
            The strategy to use when the count does not match any senario. <br />
            <strong>We recommend</strong> using a forward strategy as a fallback.
        </p>
        <SelectStrategy bind:value={value.options.fallback} idPrefix="{idPrefix}_fallback" />
    </div>

    <div>
        <h3 class="text-lg font-bold text-gray-800">Senarios</h3>
        <p class="my-3">
            The senarios to match the count. <br />
            You can add multiple senarios to match the count.
        </p>

        {#each value.options.senarios as count, index}
            <div class="bg-slate-100 m-2 shadow-xl p-4 rounded-lg">
                <div class="flex justify-between">
                    <div class="flex gap-4">
                        <div>
                            <label for="{idPrefix}-operator-{index}">Operator</label>
                            <select class="mx-2 px-2 py-1" id="{idPrefix}-operator-{index}" bind:value={count.operator}>
                                {#each operations as operation}
                                    <option value={operation}>{operation}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label for="{idPrefix}-rate-{index}">Value</label>
                            <input class="px-2 py-1 w-20" type="number" id="{idPrefix}-rate-{index}" bind:value={count.value} />
                        </div>
                    </div>
                    <div class="justify-end">
                        <button class="bg-red-400 font-medium px-2 py-1 rounded text-white hover:bg-red-600" type="button" on:click={() => deleteSenario(index)}>
                            <DeleteIcon size={18} />
                        </button>
                    </div>
                </div>
                <div>
                    <SelectStrategy bind:value={count.strategy} idPrefix="{idPrefix}_{index}_s" />
                </div>
            </div>
        {/each}

        <div class="my-4 mx-2">
            <button class="bg-gray-100 border-2 border-gray-900 border-dashed font-medium px-2 py-1 rounded w-full hover:bg-gray-200" type="button" on:click={newSenario}>
                + Add Senario
            </button>
        </div>
    </div>
    
</div>
