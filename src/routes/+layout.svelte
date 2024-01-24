<script lang="ts">
	import "../app.pcss";
</script>

<svelte:head>
	<title>ZassPrint KPS</title>
</svelte:head>

<main class="container mx-auto p-8">
	<h1
		class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-8"
	>
		ZassPrint KPS
	</h1>
	<slot />
</main>

<footer class="w-full bg-primary text-white py-4 fixed bottom-0">
	<div class="container mx-auto px-4 md:px-6 lg:px-8">
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-center">
			© 2024 ZassPrint. All rights reserved.
		</p>
	</div>
</footer>
