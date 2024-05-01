<script lang="ts">
	import SaveIcon from "$lib/atoms/SaveIcon.svelte";
	import { goto } from "$app/navigation";
    import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
	import { createTeam } from "$lib/api/teams";

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: "Create Team" }
    ];

    let name: string = ""
    let description: string = ""

    async function createNewTeam() {
        const team = await createTeam({
            name,
            description
        }, fetch);

        if (team) {
            goto(`/teams/${team.id}/sites`)
            return;
        }
    }

</script>

<div class="">
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8">
        <h1 class="block text-2xl font-bold text-accent sm:text-3xl">Team</h1>
        <p class="mt-3 sm:text-lg prose">
            Create a new team
        </p>
    </header>
    <form class="flex flex-col gap-4" on:submit|preventDefault={createNewTeam}>
        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Team's name</span>
            </div>
            <input type="text" required bind:value={name} class="input input-bordered w-full" id="team-name" placeholder="Team name">
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
