<script lang="ts">
    import { goto } from "$app/navigation";
    import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
    import { page } from "$app/stores";
    import { createSite } from "$lib/api/sites";
	import SiteForm from "$lib/organisms/forms/SiteForm.svelte";

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: $page.data.name, href: `/teams/${$page.data.id}/sites` },
        { name: "Create site" }
    ];

    let site = {
        title: "",
        description: null,
        url: null
    }

    async function createNewTeam(event: SubmitEvent) {

        event.preventDefault();

        const created = await createSite($page.data.id, site, fetch);

        if (created) {
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
    <SiteForm bind:site={site} on:submit={createNewTeam} />
</div>
