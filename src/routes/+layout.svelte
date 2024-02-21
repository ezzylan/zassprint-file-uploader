<script lang="ts">
	import { page } from "$app/stores";
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.pcss";
</script>

<svelte:head>
	<title>{$page.data.title}ZassPrint KPS</title>
</svelte:head>

<main class="container p-8">
	<h1 class="pb-8">ZassPrint KPS</h1>
	<slot />
</main>

<Toaster richColors position="top-right" />
