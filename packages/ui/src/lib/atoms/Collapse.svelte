<script lang="ts">
    export let open: boolean = false;
</script>

<div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2">
        <button class="text-sm text-left text-gray-500 w-full rounded p-2" on:click={() => open = !open}>
            <slot name="header">
                {open ? "-" : "+"}
            </slot>
        </button>
    </div>
    {#if open}
        <slot />
    {/if}
</div>