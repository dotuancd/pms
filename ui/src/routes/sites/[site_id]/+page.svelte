<script lang="ts">
    import { page } from "$app/stores";
	import Collapse from "$lib/atoms/Collapse.svelte";
	import Strategy from "$lib/organisms/Strategy.svelte";
	import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
    import { styleForMethod } from "$lib";
	import MoreMenuIcon from "$lib/atoms/MoreMenuIcon.svelte";
    import { deleteRule as requestDeleteRule } from "$lib/api/rules";
    import {invalidate} from "$app/navigation";

    const team = $page.data.site.team;

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: team.name, href: `/teams/${team.id}/sites`},
        { name: $page.data.site.title }
    ];

    let deletingRule: any = null;

    function deleteConfirmation(rule: any) {
        deletingRule = rule;
        document.getElementById('confirm-delete-modal')?.showModal();
    }

    async function deleteRule(rule: any) {
        const deleted = await requestDeleteRule(rule.id, fetch)
        if (deleted) {
            // trigger a reload of the rules
            invalidate("rules:delete")
        }
        document.getElementById('confirm-delete-modal')?.close();
    }

</script>

<svelte:head>
    <title>{$page.data.site.title} - Rules</title>
</svelte:head>
<div>
    <Breadcrumb items={breadcrumbs} />
    <header class="py-8 my-8 flex flex-row justify-between items-center">
        <div>
            <h1 class="block text-2xl font-bold text-accent sm:text-3xl">{$page.data.site.title}</h1>
            <p class="mt-3 sm:text-lg prose">
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
                                        <button on:click|preventDefault|stopPropagation|nonpassive={() => deleteConfirmation(rule)} class="text-error">
                                          Delete Rule
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1">
                            {#each rule.methods as method }
                                <span class="px-2 py-1 rounded-lg border font-bold {styleForMethod(method)}">{method == "*" ? "ALL" : method}</span>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <!-- <SelectStrategy value={rule.strategy} strategyType={rule.strategy.type} /> -->
                        <Strategy value={rule.strategy} />
                    </div>
                </Collapse>
            </div>
        {/each}
    </div>
</div>

<!-- Delete confirmation modal -->
<dialog id="confirm-delete-modal" class="modal">
  <div class="modal-box">
    <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    <h3 class="font-bold text-lg">Delete rule {deletingRule?.routes[0]}</h3>
    <p class="py-4">
        This action cannot be undone. This will permanently delete the rule <strong>{deletingRule?.routes[0]}</strong>.
    </p>

    <div class="modal-action">
        <button class="btn btn-error btn-block" on:click={() => deleteRule(deletingRule)}>
            I understand, delete this rule
        </button>
    </div>
  </div>
</dialog>