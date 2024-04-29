<script lang="ts">
    import { page } from "$app/stores";
    import SiteIcon from "$lib/atoms/SiteIcon.svelte";
</script>
<svelte:head>
    <title>{$page.data.name} - Sites</title>
</svelte:head>
<div>
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl"> {$page.data.name}</h1>
            <p class="mt-3 sm:text-lg text-gray-800 dark:text-neutral-400">
                {$page.data.description}
            </p>
        </div>
        <div class="">
            <a href="/sites/{$page.params.site_id}/create">
                <button type="button" class="bg-green-500 font-medium text-gray-100 rounded px-2 py-1">+ Add site</button>
            </a>
        </div>
    </header>
    <div class="flex flex-col shadow-lg rounded-lg">
        {#each $page.data.sites as site}
            <a class="cursor-pointer flex gap-4 items-center border-b p-4 hover:bg-gray-50" href={`/sites/${site.id}`}>
                <SiteIcon />
                <div>
                    <span class="text-sky-500 font-bold">{site.title}</span>
                    <p>{site.description}</p>
                </div>
            </a>
        {:else}
            <!-- Write a message and let user create new one -->
            <p>No sites found. <a href="/rules/{$page.params.site_id}/create">Create one</a></p>
        {/each}
    </div>
</div>