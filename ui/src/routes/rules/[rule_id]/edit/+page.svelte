<script lang="ts">
    import { page } from "$app/stores";
    import CreateNewRule from "../../[site_id]/create/+page.svelte"
</script>

<svelte:head>
    <title>Edit Rule</title>
</svelte:head>

<CreateNewRule isNew={false} strategy={$page.data.strategy} methods={$page.data.methods} routes={$page.data.routes} />