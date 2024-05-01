<script lang="ts">
  import "../app.css";

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ]

  onMount(() => {
    themeChange(false)
  })
</script>
<div class="container mx-auto bg-natual-content min-h-screen">
  <div class="navbar bg-base-100 text-base-content">
    <div class="flex-1">
      <a href="/teams" class="btn btn-ghost text-xl">PMS</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/teams">Teams</a></li>
        <li>
          <label>
            <span>Theme</span>
            <select data-choose-theme>
              {#each themes as theme}
                <option value="{theme}">{theme}</option>
              {/each}
            </select>
          </label>
        </li>
      </ul>
    </div>
  </div>
  <div class="px-2 text-base-content max-w-4xl mx-auto">
    <slot></slot>
  </div>
</div>