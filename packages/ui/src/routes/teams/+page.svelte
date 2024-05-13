<script lang="ts">
    import { page } from "$app/stores";
	import CreateButton from "$lib/atoms/CreateButton.svelte";
    import TeamIcon from "$lib/atoms/TeamIcon.svelte";
	import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";

    const breadcrumbs = [
        { name: "Teams" }
    ];
</script>

<svelte:head>
    <title>Teams</title>
</svelte:head>

<div>
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-accent sm:text-3xl">Teams</h1>
            <p class="mt-3 sm:text-lg prose">
                Teams that have access to the site
            </p>
        </div>
        <div class="">
            <a href="/teams/create" class="btn btn-primary">+ New team</a>
        </div>
    </header>
    <div class="flex flex-col gap-3">
        {#each $page.data.teams as team}
            <a class="cursor-pointer shadow rounded-box flex gap-4 items-center p-4 hover:bg-base-200" href={`/teams/${team.id}/sites`}>
                <TeamIcon />
                <div>
                    <span class="text-primary font-bold">{team.name}</span>
                    <p>{team.description || ""}</p>
                </div>
            </a>
        {/each}
    </div>
</div>