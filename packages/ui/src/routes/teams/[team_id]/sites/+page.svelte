<script lang="ts">
    import { page } from "$app/stores";
    import SiteIcon from "$lib/atoms/SiteIcon.svelte";
	import ConfirmDelete, {open, close as closeConfirmDialog} from "$lib/molecules/ConfirmDelete.svelte";
	import RowMenu from "$lib/molecules/RowMenu.svelte";
	import Tabs from "../nav.svelte";
    import { deleteSite as sendRequestDeleteSite, updateSite, createSite } from "$lib/api/sites";
	import { invalidate } from "$app/navigation";
	import Modal, {open as openSiteModal, close as closeSiteModal} from "$lib/molecules/Modal.svelte";
	import SiteForm from "$lib/organisms/forms/SiteForm.svelte";
    import Header from "../header.svelte";

    let deletingSite: any = null;
    async function deleteSite(site: any) {
        const succeed = await sendRequestDeleteSite(site.id, fetch)

        if (succeed) {
            invalidate("sites:reload");
            closeConfirmDialog();
        }
    }

    let updatetingSite = {
        id: null,
        title: "",
        description: null,
        url: null
    }

    function saveSite() {
        if (updatetingSite.id) {
            updateSite(updatetingSite.id, updatetingSite, fetch)
        } else {
            createSite($page.params.team_id, updatetingSite, fetch)
        }
        
        closeSiteModal();
        invalidate("sites:reload");
    }

    function deleteConfirmation(site: any) {
        deletingSite = site;
        open();
    }

    function editSite(site: any) {
        updatetingSite = site;
        openSiteModal();
    }
</script>
<svelte:head>
    <title>{$page.data.name} - Sites</title>
</svelte:head>
<div>
    <div class="text-sm breadcrumbs">
        <ul>
            <li><a href="/teams">Teams</a></li> 
            <li class="text-secondary font-bold">{$page.data.name}</li>
        </ul>
    </div>
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-accent sm:text-3xl"> {$page.data.name}</h1>
            <p class="mt-3 sm:text-lg prose">
                {$page.data.description}
            </p>
        </div>
        <div class="">
            <button type="button" on:click={openSiteModal} class="btn btn-primary">+ New site</button>
        </div>
    </header>
    <!-- <Header newButtonHref="/teams/{$page.params.team_id}/sites/create" newButtonLabel="+ New site" /> -->
    <Tabs activeTab="sites" />
    <div class="flex flex-col gap-3">
        {#each $page.data.sites as site}
            <a class="rounded-box shadow cursor-pointer flex gap-4 items-center justify-between p-4 hover:bg-base-200" href={`/sites/${site.id}/rules`}>
                <div>
                    <div class="flex gap-2">
                        <SiteIcon />
                        <span class="text-primary font-bold">{site.title}</span>
                    </div>
                    <p>{site.description || ""}</p>
                </div>
                <div>
                    <RowMenu>
                        <li>
                            <button type="button" on:click|preventDefault={() => editSite(site)}>
                                <span>Edit</span>
                            </button>
                        </li>
                        <li>
                            <button on:click|preventDefault|stopPropagation|nonpassive={() => deleteConfirmation(site)} class="text-error">
                              Delete
                            </button>
                        </li>
                        
                    </RowMenu>
                </div>
            </a>
        {:else}
            <div class="bg-gray-50 p-4 rounded text-center">
                No sites found. <a class="text-primary font-bold" href="/teams/{$page.params.team_id}/sites/create">Create one</a>
            </div>
        {/each}
    </div>
</div>

<!-- Delete confirmation modal -->
<ConfirmDelete on:confirmed={() => deleteSite(deletingSite)} confirmBtnText="I understand, delete this site">
</ConfirmDelete>

<Modal>
    <!-- <h3 class="font-bold text-lg">{header}</h3> -->
    <h3 slot="header" class="font-bold text-lg">Create new site</h3>

    <SiteForm bind:site={updatetingSite} on:submit={saveSite} />

    <!-- <svelte:fragment slot="actions">
        <button class="btn btn-primary btn-block" on:click={closeConfirmDialog}>
            Cancel
        </button>
    </svelte:fragment> -->
</Modal>