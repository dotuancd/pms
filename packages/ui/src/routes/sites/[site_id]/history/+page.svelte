<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import CopyIcon from '$lib/atoms/CopyIcon.svelte';
	import ClipboardJS from 'clipboard';
	import Header from '../header.svelte';
	import Tabs from '../nav.svelte';

	function styleForRequestMethod(method: string) {
		switch (method) {
			case 'GET':
				return 'text-primary';
			case 'HEAD':
				return 'text-primary';
			case 'POST':
				return 'text-secondary';
			case 'PUT':
				return 'text-accent';
			case 'DELETE':
				return 'text-error';
			case 'PATCH':
				return 'text-info';
			case 'OPTIONS':
				return 'text-warning';
		}
	}

	function styleForResponseStatusCode(code: number) {
		if (code === 200) {
			return 'text-success';
		} else {
			return 'text-red-500';
		}
	}
</script>

<svelte:head>
	<title>{$page.data.site.title} - History</title>
</svelte:head>
<div>
	<Header />
	<Tabs activeTab="history" />
	<div class="bg-base-100 p-4 rounded-box shadow hover:bg-base-200">
		{#each $page.data.history as history}
			<div class="label-text grid grid-cols-[60px_50px_1fr] mb-2">
				<p class="font-bold {styleForRequestMethod(history.request.method)}">
					{history.request.method}
				</p>
				<p class="font-bold {styleForResponseStatusCode(history.responseStatusCode)}">
					{history.responseStatusCode}
				</p>
				<!-- <span>{history.request.url}</span> -->
				<div class="bg-base-200 input input-bordered input-sm flex items-center gap-2">
					<input
						class="grow"
						readonly
						type="text"
						id="target-url"
						value="{history.request.url}"
					/>

					<button
						class="tooltip"
						data-tip="Copy url to cliboard"
						id="copy-target-url-btn"
						data-clipboard-target="#target-url"
					>
						<CopyIcon />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
