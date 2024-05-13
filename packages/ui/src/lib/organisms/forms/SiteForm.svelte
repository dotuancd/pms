<script lang="ts">
	import SaveIcon from "$lib/atoms/SaveIcon.svelte";

    type Site = {
        id?: string
        title: string
        description: string | null
        url: string | null,
        resigner?: string | {
            type: string,
            params: {
                consumerKey: string,
                consumerSecret: string,
                accessToken: string,
                tokenSecret: string
            }
        },
    }

    export let site: Site

    let resigner = "none"

    const params = {
        consumerKey: "",
        consumerSecret: "",
        accessToken: "",
        tokenSecret: ""
    }

    $: {
        if (resigner == "oauth1") {
            site.resigner = {
                type: resigner,
                params
            }
        }
        
    }

</script>
<form class="flex flex-col gap-4" on:submit>
    <label class="form-control w-full max-w-lg">
        <div class="label">
          <span class="label-text">Title</span>
        </div>
        <input type="text" required bind:value={site.title} class="input input-bordered w-full" id="site-name" placeholder="Site name">
    </label>

    <label class="form-control w-full max-w-lg">
        <div class="label">
          <span class="label-text">Site's URL</span>
        </div>
        <input type="text" bind:value={site.url} class="input input-bordered w-full" id="site-url" placeholder="https://example.com">
    </label>

    <label class="form-control w-full max-w-lg">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <textarea bind:value={site.description} class="textarea textarea-bordered w-full" id="site-description" placeholder="Description" />
    </label>

    <label class="form-control w-full max-w-lg">
        <div class="label">
          <span class="label-text">Resigner</span>
        </div>
        <select bind:value={resigner} class="select select-sm border select-bordered max-w-xs" id="site-resigner">
            <option value="none">No Resigner</option>
            <option value="oauth1">OAuth1</option>
        </select>
    </label>

    {#if resigner === "oauth1"}
        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Consumer Key</span>
            </div>
            <input bind:value={params.consumerKey} type="text" class="input input-bordered w-full" id="oauth1-consumer-key" placeholder="Consumer Key">
        </label>

        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Consumer Secret</span>
            </div>
            <input bind:value={params.consumerSecret} type="text" class="input input-bordered w-full" id="oauth1-consumer-secret" placeholder="Consumer Secret">
        </label>

        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Access Token</span>
            </div>
            <input bind:value={params.accessToken} type="text" class="input input-bordered w-full" id="oauth1-access-token" placeholder="Access Token">
        </label>

        <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Access Secret</span>
            </div>
            <input bind:value={params.tokenSecret} type="text" class="input input-bordered w-full" id="oauth1-access-secret" placeholder="Access Secret">
        </label>
    {/if}

    <div class="flex items-center gap-2">
        <button class="btn btn-primary" type="submit">
            <SaveIcon/> Save
        </button>
    </div>
</form>