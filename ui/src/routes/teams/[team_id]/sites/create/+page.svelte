<script lang="ts">
	import SaveIcon from "$lib/atoms/SaveIcon.svelte";
	import { goto } from "$app/navigation";
    import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
	import { page } from "$app/stores";
	import { createSite } from "$lib/api/sites";

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: $page.data.name, href: `/teams/${$page.data.id}/sites` },
        { name: "Create site" }
    ];

    let title: string = ""
    let description: string | null = null
    let url: null | string = null

    async function createNewTeam() {
        const site = await createSite($page.data.id, {
            title,
            url,
            description
        }, fetch);

        if (site) {
            goto(`/teams/${$page.data.id}/sites`)
            return;
        }
    }

</script>

<div class="">
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8">
        <h1 class="block text-2xl font-bold text-accent sm:text-3xl">{$page.data.name}</h1>
        <p class="mt-3 sm:text-lg prose">
            Create a new site
        </p>
    </header>
    <form class="flex flex-col gap-4" on:submit|preventDefault={createNewTeam}>
        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Title</span>
            </div>
            <input type="text" required bind:value={title} class="input input-bordered w-full" id="team-name" placeholder="Team name">
        </label>

        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Site's URL</span>
            </div>
            <input type="text" bind:value={url} class="input input-bordered w-full" id="team-name" placeholder="https://example.com">
        </label>

        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea bind:value={description} class="textarea textarea-bordered w-full" id="team-description" placeholder="Description" />
        </label>

        <div class="flex items-center gap-2">
            <button class="btn btn-primary" type="submit">
                <SaveIcon/> Save
            </button>

            <a href="/teams" class="btn btn-link">
                Back
            </a>
        </div>
    </form>
</div>
