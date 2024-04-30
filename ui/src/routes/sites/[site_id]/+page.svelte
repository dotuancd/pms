<script lang="ts">
    import { page } from "$app/stores";
	import Collapse from "$lib/atoms/Collapse.svelte";
	import Strategy from "$lib/organisms/Strategy.svelte";
	import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
    import { styleForMethod } from "$lib";
	import MoreMenuIcon from "$lib/atoms/MoreMenuIcon.svelte";

    const team = $page.data.site.team;

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: team.name, href: `/teams/${team.id}/sites`},
        { name: $page.data.site.title }
    ];

</script>

<svelte:head>
    <title>{$page.data.site.title} - Rules</title>
</svelte:head>
<div>
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-accent sm:text-3xl">{$page.data.site.title}</h1>
            <p class="mt-3 sm:text-lg text-accent-content">
                Configure the rules for the site
            </p>
        </div>
        <div>
            <a href="/rules/{$page.params.site_id}/create" class="btn btn-primary">+ Create rule</a>
        </div>
    </header>
    <div class="flex flex-col gap-3">
        {#each $page.data.rules as rule}
            <div class="bg-base-100 p-4 rounded-box shadow hover:bg-base-200">
                <Collapse>
                    <div slot="header">
                        <div class="flex flex-row justify-between">
                            <div>
                                {#each rule.routes as route}
                                    <h3 class="text-lg text-primary font-semibold">{route}</h3>
                                {/each}
                            </div>
                            <div>
                                <div class="dropdown dropdown-end">
                                    <button tabindex="0" type="button" on:click|stopPropagation|nonpassive={() => {}} class="btn btn-ghost btn-circle">
                                      <div class="w-10 rounded-full">
                                        <MoreMenuIcon />
                                      </div>
                                    </button>
                                    <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                      <li>
                                        <button on:click|preventDefault|stopPropagation|nonpassive={() => {}} class="text-error">
                                          Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-row gap-1">
                            {#each rule.methods as method }
                                <span class="px-2 py-1 rounded-lg border font-bold {styleForMethod(method)}">{method == "*" ? "ALL" : method}</span>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <Strategy value={rule.strategy} />
                    </div>
                </Collapse>
            </div>
        {/each}
    </div>
</div>