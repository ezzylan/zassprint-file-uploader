<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { AlertCircle } from "lucide-svelte";
	import Time from "svelte-time";

	const supabase = data.supabase;

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
<Alert.Root class="mb-8 bg-sky-300">
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description>
		Refresh the page to check for new files.
	</Alert.Description>
</Alert.Root>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	{#if data.data && data.data.length > 1}
		{#each data.data as file}
			{#if file.name != ".emptyFolderPlaceholder"}
				<Card.Root>
					<Card.Header>
						<Card.Title class="truncate">{file.name}</Card.Title>
					</Card.Header>
					<Card.Content class="flex justify-between">
						<div>
							<Time
								timestamp={file.created_at}
								format="hh:mm:ss a"
							/>
							(<Time timestamp={file.created_at} relative />)
						</div>
						<Time timestamp={file.created_at} format="DD/MM/YYYY" />
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button
							variant="destructive"
							on:click={() => deleteFile(file.name)}
							>Delete</Button
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
			{/if}
		{/each}
	{:else}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			No files available...
		</h4>
	{/if}
</div>
