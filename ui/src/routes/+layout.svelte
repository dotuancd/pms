<script>
    import "../app.css";
</script>
<div class="container mx-auto bg-natual-content min-h-screen">
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/teams" class="btn btn-ghost text-xl">PMS</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/teams">Teams</a></li>
        <li><a href="#">Account</a></li>
      </ul>
    </div>
  </div>
  <div class="w-full lg:w-8/12 mx-auto xxl:pt-10 pb-32">
    <slot></slot>
  </div>
</div>