import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "cupcake",
      // "emerald",
      // "cyberpunk"
    ],
  },
  plugins: [daisyui],
}

