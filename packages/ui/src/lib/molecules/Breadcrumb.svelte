
<script lang="ts">

    type Item = {
        name: string;
        href?: string;
    }

    export let items: Item[];
</script>

<div class="text-sm breadcrumbs">
    <ul>
        {#each items as item, i}
            <li>
                {#if i == items.length - 1}
                    <span class="text-secondary font-bold">{item.name}</span>
                {:else if item.href}
                    <a href="{item.href}">{item.name}</a>
                {/if}
            </li>
        {/each}
    </ul>
  </div>
