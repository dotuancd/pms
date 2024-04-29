<script lang="ts">
	import { goto } from "$app/navigation";
    import { PUBLIC_API_URL } from "$env/static/public";

    let email = "";
    let password = "";

    async function login(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const response = await fetch(`${PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
            credentials: "include"
        });
        if (response.ok) {
            goto("/teams");
        }
    }
</script>
<form class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0" on:submit|preventDefault={login}>
    <h2 class="text-gray-900 text-lg font-medium title-font mb-5 mx-auto">Sign in to PMS</h2>
    <div class="relative mb-4">
      <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
      <input type="email" bind:value={email} placeholder="alice@example.com" required id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
    </div>
    <div class="relative mb-4">
      <label for="password" class="leading-7 text-sm text-gray-600">Password</label>
      <input type="password" bind:value={password} placeholder="Password" id="password" name="password" required class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
    </div>
    <button class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign in</button>
</form>