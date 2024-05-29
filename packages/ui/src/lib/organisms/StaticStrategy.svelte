<script lang="ts">
	import type { StaticStrategy } from '$lib/Strategy';
	import DeleteIcon from '$lib/atoms/DeleteIcon.svelte';
	import CodeEditor from '$lib/molecules/CodeEditor.svelte';

	let contentTypes = new Map([
		['text/plain', 'text', ],
		['application/json', 'json', ],
		['text/html', 'html',],
		['application/xml', 'xml']
	]);
    
	type Header = { key: string; value: string };
	export let value: StaticStrategy;
	export let idPrefix = '';
	let selected = 'headers';
	let bodyType = value.options.body ? 'raw' : 'none';
	let contentType = getContentTypeFromHeaders(value.options.headers);
	let languageForEditor = getLanguageByContentType(getContentTypeFromHeaders(value.options.headers));
	let headersForEditor: Header[] = [];

	headersForEditor = value.options.headers.map((header) => {
		return {
			key: header.key,
			value: header.value
		};
	});

	headersForEditor.push({ key: '', value: '' });

	function getContentTypeFromHeaders(headers: Header[]) {
		return headers.find(h => h.key.toLowerCase() == "content-type")?.value || "text/plain"
	}

	function getLanguageByContentType(contentType: string) {
		// @TODO: support the charset option.
		return contentTypes.get(contentType) || "text"
	}

	function addNewIfLastElement(index: number) {
		if (index == headersForEditor.length - 1) {
			headersForEditor.push({ key: '', value: '' });
		}
	}

	function deleteHeader(index: number) {
		headersForEditor = headersForEditor.filter((_, i) => i !== index);
	}

	function addContentType(contentType: string) {
		headersForEditor = [
			{ key: 'Content-Type', value: contentType },
			...headersForEditor.filter((header) => header.key.toLowerCase() !== 'content-type')
		];
	}

	$: {
		if (bodyType === 'none') {
			value.options.body = null;
		}

		value.options.headers = headersForEditor.filter((header) => header.key !== '');
		languageForEditor = getLanguageByContentType(contentType)
	}
</script>

<div>
	<div class="flex justify-between items-center">
		<div role="tablist" class="tabs tabs-boxed flex flex-row gap-4">
			<button
				role="tab"
				type="button"
				on:click={() => (selected = 'headers')}
				class="tab"
				class:tab-active={selected == 'headers'}
			>
				Headers <span class="ml-1 badge badge-success badge-outline"
					>{headersForEditor.length - 1}</span
				>
			</button>
			<button
				role="tab"
				type="button"
				on:click={() => (selected = 'body')}
				class="tab"
				class:tab-active={selected == 'body'}>Body</button
			>
		</div>
		<div class="flex flex-row items-center">
			<label for="status">Status</label>
			<input
				class="input input-sm w-20 font-bold rounded-none"
				class:text-success={value.options.status < 300}
				class:text-warning={value.options.status >= 300 && value.options.status < 400}
				class:text-error={value.options.status >= 400}
				min="100"
				max="599"
				type="number"
				id="status"
				bind:value={value.options.status}
			/>
		</div>
	</div>
</div>

<div>
	{#if selected === 'headers'}
		<div class="py-2">Headers</div>
		<table class="table">
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{#each headersForEditor as header, index}
					<tr>
						<td class="p-1">
							<input
								class="input input-sm w-full rounded-none"
								type="text"
								id="{idPrefix}_{index}_hk"
								on:input={() => addNewIfLastElement(index)}
								bind:value={header.key}
								placeholder="Key"
							/>
						</td>
						<td>
							<input
								class="input input-sm w-full rounded-none"
								type="text"
								id="{idPrefix}_{index}_hv"
								on:input={() => addNewIfLastElement(index)}
								bind:value={header.value}
								placeholder="Value"
							/>
						</td>
						<td class="w-10 text-end">
							{#if index < headersForEditor.length - 1}
								<button
									type="button"
									class="p-1 rounded hover:bg-slate-100"
									on:click={() => deleteHeader(index)}
								>
									<DeleteIcon class="text-sm" size={24} />
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	{#if selected === 'body'}
		<div class="my-2 flex flex-row content-between gap-2">
			<div class="form-control">
				<label class="label cursor-pointer">
					<input
						type="radio"
						bind:group={bodyType}
						name="{idPrefix}_body"
						value="none"
						class="radio"
					/>
					<span class="label-text ml-2">none</span>
				</label>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
					<input
						type="radio"
						bind:group={bodyType}
						name="{idPrefix}_body"
						on:click={() => addContentType('text')}
						value="raw"
						class="radio"
					/>
					<span class="label-text ml-2">raw</span>
				</label>
			</div>
			{#if bodyType === 'raw'}
				<div>
					<select
						class="select select-bordered select-sm rounded-box"
						bind:value={contentType}
						on:change={(e) => addContentType(e.target?.value)}
						name="{idPrefix}_body_raw"
						id="{idPrefix}_body-raw_preset"
					>
						<option value="text/plain">Text</option>
						<option value="application/json">JSON</option>
						<option value="text/html">HTML</option>
						<option value="text/xml">XML</option>
					</select>
				</div>
			{/if}
		</div>
		{#if bodyType === 'none'}
			<div class="bg-base-200 rounded-box py-4 text-gray-800 text-center text-sm">
				This response does not have a body
			</div>
		{/if}
		{#if bodyType === 'raw'}
				<CodeEditor bind:language={languageForEditor} bind:value={value.options.body}/>
		{/if}
	{/if}
</div>
