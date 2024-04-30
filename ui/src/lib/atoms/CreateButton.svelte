
<script lang="ts">
    export let href: string;
</script>
<a href={href}>
    <button type="button" class="bg-green-500 font-medium text-gray-100 rounded px-2 py-1">
        <slot></slot>
    </button>
</a>