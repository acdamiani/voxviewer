<script>
  import Navbar from '$lib/view/sidebar/Navbar.svelte';
  import Sidebar from '$lib/view/sidebar/Sidebar.svelte';
  import ViewArea from '$lib/view/ViewArea.svelte';
</script>

<div class="flex fixed inset-0">
  <div class="flex m-4 mr-0 gap-1">
    <Navbar />
    <Sidebar />
  </div>
  <ViewArea />
</div>
