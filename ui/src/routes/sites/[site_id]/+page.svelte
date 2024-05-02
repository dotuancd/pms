<script lang="ts">
    import { page } from "$app/stores";
	import Collapse from "$lib/atoms/Collapse.svelte";
	import Strategy from "$lib/organisms/Strategy.svelte";
	import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
    import { styleForMethod } from "$lib";
    import { deleteRule as requestDeleteRule } from "$lib/api/rules";
    import {invalidate} from "$app/navigation";
	import ConfirmDelete, { open, close as closeConfirmDialog } from "$lib/molecules/ConfirmDelete.svelte";
	import RowMenu from "$lib/molecules/RowMenu.svelte";

    const team = $page.data.site.team;

    const breadcrumbs = [
        { name: "Teams", href: "/teams" },
        { name: team.name, href: `/teams/${team.id}/sites`},
        { name: $page.data.site.title }
    ];

    let deletingRule: any = null;

    function deleteConfirmation(rule: any) {
        deletingRule = rule;
        open();
    }

    async function deleteRule(rule: any) {
        const deleted = await requestDeleteRule(rule.id, fetch)
        if (deleted) {
            // trigger a reload of the rules
            invalidate("rules:delete")
            closeConfirmDialog();
        }
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
                                <RowMenu>
                                    <li>
                                        <button on:click|preventDefault|stopPropagation|nonpassive={() => deleteConfirmation(rule)} class="text-error">
                                          Delete Rule
                                        </button>
                                    </li>
                                </RowMenu>
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
<ConfirmDelete on:confirmed={() => deleteRule(deletingRule)} confirmBtnText="I understand, delete this rule">
    <p>
        This action cannot be undone. This will permanently delete the rule <strong>{deletingRule?.routes[0]}</strong>.
    </p>
</ConfirmDelete>