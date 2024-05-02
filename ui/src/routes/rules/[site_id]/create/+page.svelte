<script lang="ts">
	import { styleForMethod } from "$lib";
    import { type Strategy } from "$lib/Strategy";
	import SelectStrategy from "$lib/organisms/SelectStrategy.svelte";
	import SaveIcon from "$lib/atoms/SaveIcon.svelte";
    import { page } from "$app/stores";
    import { createRule } from "$lib/api/rules";
	import { goto } from "$app/navigation";
    import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";

    export let strategy: Strategy = {
        type: "forward",
    };

    let selectedMethods: string[] = [];
    export let routes: string[] = [""];
    export let methods: string[] = [];
    export let isNew: boolean = true;

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: $page.data.team.name, href: `/teams/${$page.data.team.id}/sites`},
        { name: $page.data.title, href: `/sites/${$page.data.id}`},
        { name: "Create Rule" }
    ];

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

        if (rule) {
            goto(`/sites/${$page.params.site_id}`)
            return;
        }
    }

</script>

<div class="">
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8">
        <h1 class="block text-2xl font-bold text-accent sm:text-3xl">Create response rule</h1>
        <p class="mt-3">
            Create a new response rule for the site
        </p>
    </header>
    <form class="flex flex-col gap-4" on:submit|preventDefault={onSubmit}>
        <div>
            <h3 class="text-sm text-accent font-semibold">Routes</h3>
            <p class="my-3">
                The route to match the request. You can use wildcards like <code class="text-accent-content bg-accent font-medium px-1 rounded-box">/users/.*</code>
                to match all routes starting with <code class="text-accent-content bg-accent font-medium px-1 rounded-box">/users/</code>.
                You can also use <code class="text-accent-content bg-accent font-medium px-1 rounded-box">/users/:userId</code> to match a specific route.
                The route must start with a <code class="text-accent-content bg-accent font-medium px-1 rounded-box">/</code>
            </p>
            <input type="text" bind:value={routes[0]} name="route" id="route" required placeholder="/example" class="input input-bordered w-full" />
        </div>
        
        <div>
            <h3 class="text-sm text-accent font-semibold">Methods</h3>
            <p class="mt-3">
                The methods that this rule should match.
            </p>
            <div class="mt-3 flex flex-wrap gap-1">
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <input type="checkbox" class="checkbox" id="method-all" on:change={toggleAll} checked={selectedMethods.length === supportedMethods.length}>
                        <span class="label-text ml-2 font-bold">ALL</span>
                    </label>
                </div>
                {#each supportedMethods as method}
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <input type="checkbox" id="method-{method}" class="checkbox" multiple bind:group={selectedMethods} value={method} />
                            <span class="label-text ml-2 font-bold {styleForMethod(method)}">{method}</span> 
                        </label>
                    </div>
                {/each}
            </div>
        </div>
    
        <div>
            <h3 class="text-sm text-accent font-semibold">Strategy</h3>
            <p class="mt-3">
                The response strategy for this rule.
            </p>
            <SelectStrategy bind:value={strategy}></SelectStrategy>
        </div>
    
        <div class="flex items-center gap-2">
            <button class="btn btn-primary" type="submit">
                <SaveIcon/> Save
            </button>

            <a href="/sites/{$page.params.site_id}" class="btn btn-link">
                Back
            </a>
        </div>
    </form>
</div>
