<script lang="ts">
	import "../app.pcss";
	import type { LayoutData } from "./$types";
	export let data: LayoutData;
</script>

<svelte:head>
	<title>ZassPrint File Uploader</title>
</svelte:head>

<div class="container mx-auto p-8">
	<h1
		class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-8"
	>
		ZassPrint File Uploader
	</h1>
	<slot {data} />
</div>
