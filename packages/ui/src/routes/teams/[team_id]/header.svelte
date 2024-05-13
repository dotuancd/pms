<script lang="ts">
	import { page } from "$app/stores";
    export let newButtonHref: string;
    export let newButtonLabel: string;
</script>
<div class="text-sm breadcrumbs">
    <ul>
        <li><a href="/teams">Teams</a></li> 
        <li class="text-secondary font-bold">{$page.data.name}</li>
    </ul>
</div>
<header class="py-8 my-8 flex flex-row justify-between items-center">
    <div>
        <h1 class="block text-2xl font-bold text-accent sm:text-3xl"> {$page.data.name}</h1>
        <p class="mt-3 sm:text-lg prose">
            {$page.data.description}
        </p>
    </div>
    <div class="">
        <a href="{newButtonHref}" class="btn btn-primary">{newButtonLabel}</a>
    </div>
</header>