<script lang="ts">
    import { page } from "$app/stores";
    import TeamIcon from "$lib/atoms/TeamIcon.svelte";
</script>

<svelte:head>
    <title>Teams</title>
</svelte:head>

<div>
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">Teams</h1>
            <p class="mt-3 sm:text-lg text-gray-800 dark:text-neutral-400">
                Teams that have access to the site
            </p>
        </div>
        <div class="">
            <a href="/sites/{$page.params.site_id}/create">
                <button type="button" class="bg-green-500 font-medium text-gray-100 rounded px-2 py-1">+ Add team</button>
            </a>
        </div>
    </header>
    <div class="flex flex-col shadow-lg rounded-lg">
        {#each $page.data.teams as team}
            <a class="cursor-pointer flex gap-4 items-center border-b p-4 hover:bg-gray-50" href={`/teams/${team.id}/sites`}>
                <TeamIcon />
                <div>
                    <span class="text-sky-500 font-bold">{team.name}</span>
                    <p>{team.description}</p>
                </div>
            </a>
        {/each}
    </div>
</div>