<script lang="ts">
	import { page } from "$app/stores";
	import MemberIcon from "$lib/atoms/MemberIcon.svelte";
    import Header from "../header.svelte";
	import Tabs from "../nav.svelte";
</script>

<svelte:head>
    <title>{$page.data.name} - Members</title>
</svelte:head>

<div>
    <Header newButtonHref="/teams/{$page.params.team_id}/members/invites" newButtonLabel="Invite members" />
    <Tabs activeTab="members" />
    <div class="flex flex-col">
        {#each $page.data.members as member}
            <a  href="#" class="cursor-pointer rounded-box shadow flex gap-4 items-center p-4 hover:bg-base-200">
                <MemberIcon />
                <div>
                    <span class="text-primary font-bold">{member.name}</span>
                    <p>{member.email}</p>
                </div>
            </a>
        {/each}
    </div>
</div>