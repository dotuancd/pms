<script lang="ts">
	import { page } from "$app/stores";
	import SiteIcon from "$lib/atoms/SiteIcon.svelte";
	import TeamIcon from "$lib/atoms/TeamIcon.svelte";

    export let activeTab: "sites" | "members" = 'sites';
</script>
<div role="tablist" class="flex font-semibold tabs tabs-boxed mb-10">
  <a role="tab" class="tab flex gap-3" class:border-primary={activeTab == 'sites'} class:text-primary={activeTab == 'sites'} class:tab-active={activeTab == 'sites'} href="/teams/{$page.params.team_id}/sites">
    <SiteIcon /> Sites
  </a>
  
  <a role="tab" class="tab flex gap-3" class:tab-active={activeTab == 'members'} href="/teams/{$page.params.team_id}/members">
    <TeamIcon /> Members
    </a>
</div>