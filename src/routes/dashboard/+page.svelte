<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any;
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import Time from "svelte-time";

	const supabase = data.supabase;

	async function viewFile(filePath: string) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(filePath);

		if (error) {
			console.log(error);
		} else {
			window.open(data.publicUrl);
		}
	}

	async function downloadFile(filePath: string) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(filePath, {
				download: true,
			});

		if (error) {
			console.log(error);
		} else {
			window.open(data.publicUrl);
		}
	}

	async function deleteFile(filePath: string) {
		const { data, error } = await supabase.storage
			.from("files")
			.remove([filePath]);

		if (error) {
			console.log(error);
		} else {
			location.reload();
		}
	}
</script>

<h2 class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight first:mt-0">
	Dashboard
</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#if data.data.length > 0}
		{#each data.data as file}
			{#if file.name != ".emptyFolderPlaceholder"}
				<Card.Root>
					<Card.Header>
						<Card.Title class="truncate">{file.name}</Card.Title>
					</Card.Header>
					<Card.Content>
						<Time timestamp={file.created_at} format="hh:mm:ss a" />
						(<Time timestamp={file.created_at} relative />)
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button
							variant="destructive"
							on:click={() => deleteFile(file.name)}
							>Delete</Button
						>
						<div class="flex gap-2">
							<Button on:click={() => viewFile(file.name)}
								>View</Button
							>
							<Button
								variant="secondary"
								on:click={() => downloadFile(file.name)}
								>Download</Button
							>
						</div>
					</Card.Footer>
				</Card.Root>
			{/if}
		{/each}
	{:else}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			No files available...
		</h4>
	{/if}
</div>
