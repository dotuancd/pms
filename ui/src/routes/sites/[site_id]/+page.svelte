<script lang="ts">
    import { page } from "$app/stores";
	import Collapse from "$lib/atoms/Collapse.svelte";
	import Strategy from "$lib/organisms/Strategy.svelte";
    import { styleForMethod } from "$lib";
</script>

<svelte:head>
    <title>{$page.data.site.title} - Rules</title>
</svelte:head>
<div>
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">{$page.data.site.title}</h1>
            <p class="mt-3 sm:text-lg text-gray-800 dark:text-neutral-400">
                Configure the rules for the site
            </p>
        </div>
        <div class="">
            <a href="/rules/{$page.params.site_id}/create">
                <button type="button" class="bg-green-500 font-medium text-gray-100 rounded px-2 py-1">+ Add rule</button>
            </a>
        </div>
    </header>
    <div class="flex flex-col gap-2">
        {#each $page.data.rules as rule}
            <div class="bg-gray-50 p-4 rounded shadow">
                <Collapse>
                    <div slot="header">
                        {#each rule.routes as route}
                            <h3 class="text-lg text-sky-600 font-semibold">{route}</h3>
                        {/each}
                        <div class="flex flex-row gap-1">
                            {#each rule.methods as method }
                                <span class="px-2 py-1 rounded-lg border font-bold {styleForMethod(method)}">{method == "*" ? "ALL" : method}</span>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <Strategy value={rule.strategy} />
                    </div>
                </Collapse>
            </div>
        {/each}
    </div>
</div>