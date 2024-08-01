<script lang="ts">
	import { page } from '$app/stores';

	export let activeTab: 'rules' | 'history' = 'rules';
</script>

<div role="tablist" class="flex font-semibold tabs tabs-boxed mb-10">
	<a
		role="tab"
		class="tab flex gap-3"
		class:border-primary={activeTab == 'rules'}
		class:text-primary={activeTab == 'rules'}
		class:tab-active={activeTab == 'rules'}
		href="/sites/{$page.params.site_id}/rules"
	>
		Rules
	</a>

	<a
		role="tab"
		class="tab flex gap-3"
		class:tab-active={activeTab == 'history'}
		href="/sites/{$page.params.site_id}/history"
	>
		History
	</a>
</div>
