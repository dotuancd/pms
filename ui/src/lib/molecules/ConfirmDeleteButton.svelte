
<script>
    import { createEventDispatcher } from "svelte";
    import ConfirmDelete, {showModal} from "./ConfirmDelete.svelte";

    const dispatch = createEventDispatcher();
</script>

<button on:click|preventDefault|stopPropagation|nonpassive={() => showModal() } class="text-error">
    <slot></slot>
</button>

<ConfirmDelete on:confirmed={() => dispatch("confirmed")} />