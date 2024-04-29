<script lang="ts">
	import { styleForMethod } from "$lib";
    import { type Strategy } from "$lib/Strategy";
	import SelectStrategy from "$lib/organisms/SelectStrategy.svelte";
	import SaveIcon from "$lib/atoms/SaveIcon.svelte";
    import { page } from "$app/stores";
    import { createRule } from "$lib/api/rules";

    export let strategy: Strategy = {
        type: "forward",
    };

    let selectedMethods: string[] = [];
    export let routes: string[] = [""];
    export let methods: string[] = [];
    export let isNew: boolean = true;

    const supportedMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

    if (! isNew && methods.includes("*")) {
        selectedMethods = [...supportedMethods];
    }

    function toggleAll(e: any) {
        selectedMethods = e.target?.checked ? [...supportedMethods] : [];
    }

    $: methods = selectedMethods.length === supportedMethods.length ? ["*"] : selectedMethods;

    async function onSubmit() {
        const rule = await createRule($page.params.site_id, {
            routes,
            methods,
            strategy,
        }, fetch);

        alert("Rule created");
    }

</script>

<div class="">
    <header class="pb-8 mb-8">
        <h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">Create response rule</h1>
        <p class="mt-3 sm:text-lg text-gray-800 dark:text-neutral-400">
            Create a new response rule for the site
        </p>
    </header>
    <form class="flex flex-col gap-4" on:submit|preventDefault={onSubmit}>
        <div>
            <h3 class="text-sm text-sky-500 font-semibold">Routes</h3>
            <p class="my-3 text-gray-600">
                The route to match the request. You can use wildcards like <code class="text-orange-400 font-medium bg-slate-100 px-1 rounded">/users/.*</code>
                to match all routes starting with <code class="text-orange-400 font-medium bg-slate-100 px-1 rounded">/users/</code>.
                You can also use <code class="text-orange-400 font-medium bg-slate-100 px-1 rounded">/users/:userId</code> to match a specific route.
                The route must start with a <code class="text-orange-400 font-medium bg-slate-100 px-1 rounded">/</code>
            </p>
            <input type="text" bind:value={routes[0]} class="p-2 border rounded w-full" name="route" id="route" placeholder="/example" required>
        </div>
        
        <div>
            <h3 class="text-sm text-sky-500 font-semibold">Methods</h3>
            <p class="mt-3 text-gray-600">
                The methods that this rule should match.
            </p>
            <div class="mt-3 flex flex-row gap-1">
                <div>
                    <input type="checkbox" on:change={toggleAll} checked={selectedMethods.length === supportedMethods.length} id="method-all">
                    <label for="method-all">ALL</label>
                </div>
                {#each supportedMethods as method}
                    <div>
                        <input type="checkbox" multiple bind:group={selectedMethods} value={method} id={"method-" + method.toLowerCase()}>
                        <label for={"method-" + method.toLowerCase()} class="font-bold {styleForMethod(method)}">{method}</label>
                    </div>
                {/each}
            </div>
        </div>
    
        <div>
            <h3 class="text-sm text-sky-500 font-semibold">Strategy</h3>
            <p class="mt-3 text-gray-600">
                The response strategy for this rule.
            </p>
            <SelectStrategy bind:value={strategy} strategyType={strategy.type} bind:isNew></SelectStrategy>
        </div>
    
        <div class="flex items-center gap-2">
            <button class="text-center inline-flex font-semibold items-center bg-green-600 hover:bg-green-700 px-2 py-1 text-gray-100 rounded" type="submit">
                <SaveIcon/> Save
            </button>

            <a href="/sites/{$page.params.site_id}">
                <button type="button" class="text-center inline-flex font-semibold items-center hover:text-sky-800 px-2 py-1 text-gray-600 rounded">
                    Back
                </button>
            </a>
        </div>
    </form>
</div>
