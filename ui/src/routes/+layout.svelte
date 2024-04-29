<script>
    import "../app.css";
</script>
<div class="container mx-auto bg-white min-h-screen">
  <header class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-800">
    <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
      <a class="flex-none text-xl font-semibold dark:text-white" href="#">PSM</a>
      <div class="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
        <a class="font-medium text-blue-500" href="/teams" aria-current="page">Teams</a>
        <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">Account</a>
        <!-- <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">Work</a>
        <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">Blog</a> -->
      </div>
    </nav>
  </header>
  <div class="w-full lg:w-8/12 mx-auto pt-10">
    <slot></slot>
  </div>
</div>