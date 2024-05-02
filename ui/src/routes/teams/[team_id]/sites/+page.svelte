<script lang="ts">
    import { page } from "$app/stores";
    import SiteIcon from "$lib/atoms/SiteIcon.svelte";
	import TeamIcon from "$lib/atoms/TeamIcon.svelte";
	import ConfirmDelete, {open, close as closeConfirmDialog} from "$lib/molecules/ConfirmDelete.svelte";
	import RowMenu from "$lib/molecules/RowMenu.svelte";
	import Header from "../header.svelte";
	import Tabs from "../nav.svelte";
    import { deleteSite as sendRequestDeleteSite } from "$lib/api/sites";
	import { invalidate } from "$app/navigation";

    let deletingSite: any = null;
    async function deleteSite(site: any) {
        const succeed = await sendRequestDeleteSite(site.id, fetch)

        if (succeed) {
            invalidate("sites:delete");
            closeConfirmDialog();
        }
    }

    function deleteConfirmation(site: any) {
        deletingSite = site;
        open();
    }
</script>
<svelte:head>
    <title>{$page.data.name} - Sites</title>
</svelte:head>
<div>
    <Header newButtonHref="/teams/{$page.params.team_id}/sites/create" newButtonLabel="+ New site" />
    <Tabs activeTab="sites" />
    <div class="flex flex-col gap-3">
        {#each $page.data.sites as site}
            <a class="rounded-box shadow cursor-pointer flex gap-4 items-center justify-between p-4 hover:bg-base-200" href={`/sites/${site.id}`}>
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
                            <button on:click|preventDefault|stopPropagation|nonpassive={() => deleteConfirmation(site)} class="text-error">
                              Delete Site
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