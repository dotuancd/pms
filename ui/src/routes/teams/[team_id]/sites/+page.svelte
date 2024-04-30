<script lang="ts">
    import { page } from "$app/stores";
    import SiteIcon from "$lib/atoms/SiteIcon.svelte";
	import TeamIcon from "$lib/atoms/TeamIcon.svelte";
	import Header from "../header.svelte";
	import Tabs from "../nav.svelte";
</script>
<svelte:head>
    <title>{$page.data.name} - Sites</title>
</svelte:head>
<div>
    <Header newButtonHref="/teams/{$page.params.team_id}/sites/create" newButtonLabel="+ New site" />
    <Tabs activeTab="sites" />
    <div class="flex flex-col gap-3">
        {#each $page.data.sites as site}
            <a class="rounded-box shadow cursor-pointer flex gap-4 items-center p-4 hover:bg-base-200" href={`/sites/${site.id}`}>
                <SiteIcon />
                <div>
                    <span class="text-primary font-bold">{site.title}</span>
                    <p>{site.description}</p>
                </div>
            </a>
        {:else}
            <!-- Write a message and let user create new one -->
            <div class="bg-gray-50 p-4 rounded text-center">
                No sites found. <a class="text-primary font-bold" href="/teams/{$page.params.team_id}/sites/create">Create one</a>
            </div>
        {/each}
    </div>
</div>