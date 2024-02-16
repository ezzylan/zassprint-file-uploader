<script lang="ts">
	import { page } from "$app/stores";
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.pcss";
</script>

<svelte:head>
	<title>{$page.data.title}ZassPrint KPS</title>
</svelte:head>

<main class="container p-8">
	<h1
		class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-8"
	>
		ZassPrint KPS
	</h1>
	<slot />
</main>

<Toaster richColors position="top-right" />
