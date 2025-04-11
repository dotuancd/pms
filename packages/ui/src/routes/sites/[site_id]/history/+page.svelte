<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import CopyIcon from '$lib/atoms/CopyIcon.svelte';
	import ClipboardJS from 'clipboard';
	import Header from '../header.svelte';
	import Tabs from '../nav.svelte';
	import { goto } from '$app/navigation';

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

	// Pagination options
	const limitOptions = [5, 10, 20, 50, 100];
	
	function changePage(newPage: number) {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('page', newPage.toString());
		goto(currentUrl.toString());
	}

	function changeLimit(event: Event) {
		const target = event.target as HTMLSelectElement;
		const limit = target.value;
		
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('limit', limit);
		currentUrl.searchParams.set('page', '1'); // Reset to page 1 when changing limit
		goto(currentUrl.toString());
	}
</script>

<svelte:head>
	<title>{$page.data.site.title} - History</title>
</svelte:head>
<div>
	<Header />
	<Tabs activeTab="history" />
	<div class="bg-base-100 p-4 rounded-box shadow hover:bg-base-200">
		{#each $page.data.historyData.data as history}
			<div class="label-text grid grid-cols-[60px_50px_1fr] mb-2">
				<p class="font-bold {styleForRequestMethod(history.request.method)}">
					{history.request.method}
				</p>
				<p class="font-bold {styleForResponseStatusCode(history.responseStatusCode)}">
					{history.responseStatusCode}
				</p>
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
						data-tip="Copy url to clipboard"
						id="copy-target-url-btn"
						data-clipboard-target="#target-url"
					>
						<CopyIcon />
					</button>
				</div>
			</div>
		{/each}
		
		{#if $page.data.historyData.data.length === 0}
			<div class="text-center py-4 text-gray-500">
				No history records found
			</div>
		{/if}
	</div>
	
	<!-- Pagination controls with all elements on a single row -->
	<div class="mt-8 mb-10">
		<div class="flex justify-between items-center">
			<div class="flex items-center">
				<span class="mr-2">Records per page:</span>
				<select 
					class="select select-bordered select-sm" 
					value={$page.data.pagination.limit}
					on:change={changeLimit}
				>
					{#each limitOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
			
			{#if $page.data.historyData.meta.totalPages > 1}
				<div class="join">
					<button 
						class="join-item btn btn-sm" 
						disabled={$page.data.historyData.meta.page === 1}
						on:click={() => changePage($page.data.historyData.meta.page - 1)}
					>
						«
					</button>
					
					{#each Array(Math.min(5, $page.data.historyData.meta.totalPages)) as _, i}
						{@const pageNum = i + 1}
						<button 
							class="join-item btn btn-sm" 
							class:btn-active={pageNum === $page.data.historyData.meta.page}
							on:click={() => changePage(pageNum)}
						>
							{pageNum}
						</button>
					{/each}
					
					{#if $page.data.historyData.meta.totalPages > 5}
						{#if $page.data.historyData.meta.page > 5}
							<button class="join-item btn btn-sm btn-disabled">...</button>
							<button 
								class="join-item btn btn-sm btn-active" 
								on:click={() => changePage($page.data.historyData.meta.page)}
							>
								{$page.data.historyData.meta.page}
							</button>
						{/if}
						
						{#if $page.data.historyData.meta.page < $page.data.historyData.meta.totalPages - 4}
							<button class="join-item btn btn-sm btn-disabled">...</button>
							<button 
								class="join-item btn btn-sm" 
								on:click={() => changePage($page.data.historyData.meta.totalPages)}
							>
								{$page.data.historyData.meta.totalPages}
							</button>
						{/if}
					{/if}
					
					<button 
						class="join-item btn btn-sm" 
						disabled={$page.data.historyData.meta.page === $page.data.historyData.meta.totalPages}
						on:click={() => changePage($page.data.historyData.meta.page + 1)}
					>
						»
					</button>
				</div>
			{/if}
			
			<div class="text-sm">
				Showing {$page.data.historyData.data.length} of {$page.data.historyData.meta.total} records
			</div>
		</div>
	</div>
</div>
