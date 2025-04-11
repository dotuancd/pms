<script>
	import { page } from "$app/stores";
	import { PUBLIC_API_URL } from "$env/static/public";
	import CopyIcon from "$lib/atoms/CopyIcon.svelte";
	import Breadcrumb from "$lib/molecules/Breadcrumb.svelte";
	import ClipboardJS from "clipboard";

	const team = $page.data.site.team;

	const breadcrumbs = [
		{ name: 'Teams', href: '/teams' },
		{ name: team.name, href: `/teams/${team.id}/sites` },
		{ name: $page.data.site.title }
	];


	const clipboard = new ClipboardJS('#copy-request-prefix-btn', {
		action: function (trigger) {
			trigger.setAttribute('aria-label', 'Copied!');
			trigger.setAttribute('data-tip', 'Copied!');

			setTimeout(() => {
				trigger.setAttribute('aria-label', 'Copy url to cliboard');
				trigger.setAttribute('data-tip', 'Copy url to cliboard');
			}, 2000);

			return 'copy';
		}
	});

</script>
<div>
	<Breadcrumb items={breadcrumbs} />
	<header class="py-8 my-8 flex flex-row justify-between items-center">
		<div>
			<h1 class="block text-2xl font-bold text-accent sm:text-3xl">{$page.data.site.title}</h1>
			<p class="mt-3 sm:text-lg prose">Configure the rules for the site</p>
			<div class="mt-2 bg-base-200 input input-bordered input-sm flex items-center gap-2">
				<label class="label-text"
					>URL
					<input
						class="grow"
						readonly
						type="text"
						id="request-prefix"
						value="{PUBLIC_API_URL}/p/{$page.params.site_id}/"
					/>
				</label>

				<button
					class="tooltip"
					data-tip="Copy url to cliboard"
					id="copy-request-prefix-btn"
					data-clipboard-target="#request-prefix"
				>
					<CopyIcon />
				</button>
			</div>
		</div>
		<div>
			<a href="/rules/{$page.params.site_id}/create" class="btn btn-primary">+ Create rule</a>
		</div>
	</header>
</div>