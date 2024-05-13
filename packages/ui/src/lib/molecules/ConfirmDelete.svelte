<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let confirmBtnText = 'I understand, delete this';
    export let header = 'Are you sure?';
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
      <h3 class="font-bold text-lg">{header}</h3>
            
      <p class="py-4">
        <slot>
            This action cannot be undone. Are you sure you want to proceed?
        </slot>
      </p>
      
      <div class="modal-action">
          <button class="btn btn-error btn-block" on:click={() => dispatch('confirmed')}>
              {confirmBtnText}
          </button>
      </div>
    </div>
  </dialog>