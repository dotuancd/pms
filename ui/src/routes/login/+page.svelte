<script lang="ts">
	import { goto } from "$app/navigation";
    import { login as apiLogin } from "$lib/api/auth";

    let email = "";
    let password = "";

    async function login(event: Event) {
        const response = await apiLogin(email, password, fetch);
        if (response.ok) {
            goto("/teams");
        }
    }
</script>
<!-- <form class="md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col mx-auto w-full mt-10" on:submit|preventDefault={login}>
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
</form> -->
<!-- <div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row-reverse">
    
  </div>
</div> -->
<div class="mx-auto">
  <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
    <form class="card-body" on:submit|preventDefault={login}>
      <h2 class="text-accent text-lg font-medium title-font mb-5 mx-auto">Sign in to PMS</h2>
      <div class="form-control">
        <label class="label" for="email" >
          <span class="label-text">Email</span>
        </label>
        <input type="email" id="email" bind:value={email} placeholder="alice@example.com" class="input input-bordered" required />
      </div>
      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <input type="password" bind:value={password} id="password" placeholder="password" class="input input-bordered" required />
        <!-- <label class="label">
          <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
        </label> -->
      </div>
      <div class="form-control mt-6">
        <button class="btn btn-primary">Login</button>
      </div>
    </form>
  </div>
</div>
