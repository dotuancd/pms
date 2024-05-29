<script lang="ts">
	import { html } from '@codemirror/lang-html';
	import { json, jsonParseLinter } from '@codemirror/lang-json';
	import { xml } from '@codemirror/lang-xml';
	import { linter } from '@codemirror/lint';
	import { StateEffect } from '@codemirror/state';
	import { showPanel, type Panel } from '@codemirror/view';
	import prettierPluginXml from "@prettier/plugin-xml";
	import { EditorView, basicSetup } from 'codemirror';
	import * as prettier from "prettier";
	import prettierPluginBabel from "prettier/plugins/babel";
	import prettierPluginEstree from "prettier/plugins/estree";
	import prettierPluginHtml from "prettier/plugins/html";
	import { onDestroy, onMount } from 'svelte';

	export let language: string;
	export let value: string | null;
	let highlighter: HTMLElement;
	let editor: EditorView;

	const theme = EditorView.theme({
		'.cm-gutters': {
			backgroundColor: 'oklch(var(--b1))',
			borderRightColor: 'oklch(var(--bc)/var(--tw-border-opacity))'
		},
		'.cm-panels-top': {
			borderBottom: '1px solid oklch(var(--bc)/var(--tw-border-opacity)) !important'
		},
		'.cm-panels': {
			backgroundColor: 'transparent !important'
		}
	});

	function getLanguage(lang: string) {
		switch (lang) {
			case 'json':
				return [json(), linter(jsonParseLinter())];
			case 'xml':
				return [xml()];
			case 'html':
				return [html()];
			default:
				return [];
		}
	}

	function getParser(lang: string): prettier.Options {
		switch (lang) {
			case 'json':
				return {parser: 'json', plugins: [prettierPluginBabel, prettierPluginEstree]}
			case 'xml':
			return {parser: 'babel', plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginXml]};
			case 'html':
				return {parser: 'html', plugins: [prettierPluginHtml]};
			default:
				return {};
		}
	}

	function beautifierPanel(view: EditorView): Panel {
		let dom = document.createElement('div');
		dom.className = 'grid justify-items-end bg-base-100';
		let button = document.createElement('button');
		button.className = 'btn btn-ghost btn-xs my-1 mr-1 text-gray-500';
		button.textContent = 'Beautify';
		button.addEventListener('click', async (event) => {
			event.preventDefault();
			const text = await prettier.format(
				editor.state.doc.toString(), getParser(language))
			editor.dispatch({
				changes: {from: 0, to: editor.state.doc.length, insert: text}
			})
		});
		dom.appendChild(button);
		return { top: true, dom };
	}

	const beautifier = showPanel.of(beautifierPanel);

	function recreateEditor(lang: string) {
		if (!highlighter) {
			return;
		}

		const extensions = [basicSetup, theme, ...getLanguage(lang), beautifier];

		if (editor) {
			editor.dispatch({
				effects: StateEffect.reconfigure.of(extensions)
			});
		} else {
			editor = new EditorView({
				doc: value || '',
				extensions,
				parent: highlighter
			});
		}
	}

	$: {
		recreateEditor(language);
	}

	onMount(() => {
		recreateEditor(language);

		highlighter.addEventListener('keyup', () => {
			value = editor.state.doc.toString();
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div bind:this={highlighter} class="min-h-100 w-full code-editor" />

<style>
	.code-editor {
		--tw-border-opacity: 0.2;
		border: solid 1px oklch(var(--bc) / var(--tw-border-opacity));
	}

	.code-editor::selection {
		background-color: red;
	}
</style>
