<script>
import MoreMenuIcon from "$lib/atoms/MoreMenuIcon.svelte";
</script>
<div class="dropdown dropdown-end">
    <button tabindex="0" type="button" on:click|preventDefault|stopPropagation|nonpassive={() => {}} class="btn btn-ghost btn-circle">
      <div class="w-10 rounded-full">
        <MoreMenuIcon />
      </div>
    </button>
    <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <slot></slot>
    </ul>
</div>