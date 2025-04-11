<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { styleForMethod } from '$lib';
	import { deleteRule as requestDeleteRule } from '$lib/api/rules';
	import Collapse from '$lib/atoms/Collapse.svelte';
	import ConfirmDelete, {
		close as closeConfirmDialog,
		open
	} from '$lib/molecules/ConfirmDelete.svelte';
	import RowMenu from '$lib/molecules/RowMenu.svelte';
	import Strategy from '$lib/organisms/Strategy.svelte';
	import Header from '../header.svelte';
	import Tabs from '../nav.svelte';

	let deletingRule: any = null;

	function deleteConfirmation(rule: any) {
		deletingRule = rule;
		open();
	}

	async function deleteRule(rule: any) {
		const deleted = await requestDeleteRule(rule.id, fetch);
		if (deleted) {
			// trigger a reload of the rules
			invalidate('rules:delete');
			closeConfirmDialog();
		}
	}
</script>

<svelte:head>
	<title>{$page.data.site.title} - Rules</title>
</svelte:head>
<div>
	<Header />
	<Tabs activeTab='rules'/>

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
										<button
											on:click|preventDefault|stopPropagation|nonpassive={() =>
												deleteConfirmation(rule)}
											class="text-error"
										>
											Delete Rule
										</button>
									</li>
								</RowMenu>
							</div>
						</div>

						<div class="flex flex-wrap gap-1">
							{#each rule.methods as method}
								<span class="px-2 py-1 rounded-lg border font-bold {styleForMethod(method)}"
									>{method == '*' ? 'ALL' : method}</span
								>
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

<!-- <input type="radio" name="site-tabs" role="tab" class="tab" aria-label="History" />
		<div role="tabpanel" class="tab-content p-10">
			{#each history as history}
				<p class="label-text grid grid-cols-[60px_50px_1fr]">
					<span class="font-bold {getRequestMethodClass(history.request.method)}">
						{history.request.method}
					</span>
					<span class="font-bold {getResponseStatusCode(history.responseStatusCode)}">
						{history.responseStatusCode}
					</span>
					<span>{PUBLIC_API_URL}{history.request.url}</span>
				</p>
			{/each}
		</div>
	</div> -->
<!-- </div> -->

<!-- Delete confirmation modal -->
<ConfirmDelete
	on:confirmed={() => deleteRule(deletingRule)}
	confirmBtnText="I understand, delete this rule"
>
	<p>
		This action cannot be undone. This will permanently delete the rule <strong
			>{deletingRule?.routes[0]}</strong
		>.
	</p>
</ConfirmDelete>
