<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { AlertCircle } from "lucide-svelte";
	import { Reload } from "radix-icons-svelte";
	import { onMount } from "svelte";
	import Time from "svelte-time";

	const supabase = data.supabase;
	let files: any[];
	let deletedFileNames: any[];
	let disabled = false;

	async function getFiles() {
		files = [];
		deletedFileNames = [];

		const { data, error } = await supabase.storage
			.from("files")
			.list("", { sortBy: { column: "created_at", order: "desc" } });

		if (data) {
			data.map((file) => {
				files = [...files, file];
			});
		}
	}

	async function openFile(filePath: string, download = false) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(filePath, { download: download });

		if (error) {
			console.log(error);
		} else {
			window.open(data.publicUrl);
		}
	}

	async function checkFiles() {
		disabled = true;

		if (deletedFileNames.length > 0) {
			const { data, error } = await supabase.storage
				.from("files")
				.remove(deletedFileNames);

			if (error) {
				console.log(error);
			}
		}

		getFiles();
		disabled = false;
	}

	onMount(getFiles);
</script>

<div class="flex justify-between">
	<h2
		class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight first:mt-0"
	>
		Dashboard
	</h2>
	<Button {disabled} on:click={checkFiles}>
		{#if disabled}
			<Reload class="mr-2 h-4 w-4 animate-spin" />
			Refreshing...
		{:else}
			Refresh
		{/if}
	</Button>
</div>

<Alert.Root class="mb-8 bg-sky-300">
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description>
		Refresh the page to check for new files.
	</Alert.Description>
</Alert.Root>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#if files && files.length > 0}
		{#each files as file}
			<Card.Root>
				<Card.Header>
					<Card.Title class="truncate">{file.name}</Card.Title>
				</Card.Header>
				<Card.Content class="flex justify-between">
					<div>
						<Time timestamp={file.created_at} format="hh:mm:ss a" />
						(<Time timestamp={file.created_at} relative />)
					</div>
					<Time timestamp={file.created_at} format="DD/MM/YYYY" />
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button
						variant="destructive"
						on:click={() => {
							deletedFileNames = [...deletedFileNames, file.name];
							files = files.filter((f) => f != file);
						}}>Delete</Button
					>
					<div class="flex gap-2">
						<Button on:click={() => openFile(file.name)}
							>View</Button
						>
						<Button
							variant="secondary"
							on:click={() => openFile(file.name, true)}
							>Download</Button
						>
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	{:else}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			No files available...
		</h4>
	{/if}
</div>
