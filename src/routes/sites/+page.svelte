<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#each $data.sites as site}
    <div>
        <h1>{site.name}</h1>
        <p>{site.description}</p>
    </div>
{:else}
    <p>No tasks today!</p>
{/each}