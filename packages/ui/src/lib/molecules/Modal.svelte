<script lang="ts">
    export let header = 'Header';
</script>

<script lang="ts" context="module">
    let dialog: HTMLDialogElement;
    export function open() {
        dialog.showModal();
    }

    export function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog} class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <slot name="header">
            <h3 class="font-bold text-lg">{header}</h3>
        </slot>

        <slot />
        
        <!-- <div class="modal-action">
            <slot name="actions" />
        </div> -->
        <!-- <div class="modal-action">
            <button class="btn btn-error btn-block" on:click={() => dispatch('confirmed')}>
                {confirmBtnText}
            </button>
        </div> -->
    </div>
  </dialog>