<script>
  import Navbar from '$lib/view/sidebar/Navbar.svelte';
  import Sidebar from '$lib/view/sidebar/Sidebar.svelte';
  import ViewArea from '$lib/view/ViewArea.svelte';
</script>

<svelte:head>
  <title>VoxViewer - See What Your Voice Looks Like in Your Browser</title>
  <meta
    name="description"
    content="See What Your Voice Looks Like in Your Browser"
  />
</svelte:head>

<div class="flex fixed inset-0">
  <div class="flex m-4 mr-0 gap-1">
    <Navbar />
    <Sidebar />
  </div>
  <ViewArea />
</div>
