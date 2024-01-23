<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";

	import { AlertCircle, Eye, Loader2, Trash2 } from "lucide-svelte";
	import { onMount } from "svelte";

	const supabase = data.supabase;
	let folders: any[];
	let files: any[];
	let deletedFileNames: string[] = [];
	let isRefreshing = true;

	function getFiles() {
		folders = [];
		files = [];

		setTimeout(async () => {
			const { data, error } = await supabase.storage
				.from("files")
				.list("");

			if (data) {
				data.map((folder) => (folders = [...folders, folder]));
			}

			folders.map(async (folder) => {
				const { data, error } = await supabase.storage
					.from("files")
					.list(folder.name, {
						sortBy: { column: "created_at", order: "desc" },
					});

				if (data) {
					data.map((file) => {
						files = [...files, { folder: folder.name, file: file }];
					});
				}
			});

			isRefreshing = false;
		}, 1000);
		deletedFileNames = [];
	}

	async function openFile(folderName: string, fileName: string) {
		const { data, error } = await supabase.storage
			.from("files")
			.getPublicUrl(`${folderName}/${fileName}`);

		if (error) {
			console.log(error);
		} else {
			window.open(data.publicUrl);
		}
	}

	function removeFile(file: any) {
		deletedFileNames = [
			...deletedFileNames,
			`${file.folder}/${file.file.name}`,
		];
		files = files.filter((f) => f.file !== file.file);

		const notContained = files.every((f) => {
			return f.folder !== file.folder;
		});
		if (notContained) {
			folders = folders.filter((f) => f.name !== file.folder);
		}
	}

	function removeFolder(folderName: string) {
		const filesToBeDeleted = files.filter((f) => f.folder === folderName);
		filesToBeDeleted.map((file) => {
			deletedFileNames = [
				...deletedFileNames,
				`${file.folder}/${file.file.name}`,
			];
		});
		files = files.filter((f) => f.folder !== folderName);
		folders = folders.filter((folder) => folder.name !== folderName);
	}

	async function checkFiles() {
		isRefreshing = true;

		if (deletedFileNames.length > 0) {
			const { data, error } = await supabase.storage
				.from("files")
				.remove(deletedFileNames);

			if (error) {
				console.log(error);
			}
		}

		getFiles();
	}

	onMount(getFiles);
</script>

<div class="flex justify-between">
	<h2
		class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight first:mt-0"
	>
		Dashboard
	</h2>
	<Button disabled={isRefreshing} on:click={checkFiles}>
		{#if isRefreshing}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
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
		Click the "Refresh" button to check for new files.
	</Alert.Description>
</Alert.Root>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#if isRefreshing}
		{#each Array(3) as _}
			<Card.Root>
				<Card.Header>
					<Skeleton class="w-[100px] h-[20px]" />
				</Card.Header>
				<Card.Content>
					<div
						class="flex justify-between items-center space-x-4 rounded-md border p-4"
					>
						<Skeleton class="w-[200px] h-[20px]" />
						<div class="flex gap-2">
							<Skeleton class="w-[55px] h-10 rounded-md" />
							<Skeleton class="w-[55px] h-10 rounded-md" />
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Skeleton class="w-[100px] h-10 rounded-md" />
				</Card.Footer>
			</Card.Root>
		{/each}
	{:else if folders && folders.length > 0}
		{#each folders as folder}
			<Card.Root>
				<Card.Header>
					<Card.Title class="truncate">{folder.name}</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{#each files.filter((f) => f.folder === folder.name) as file}
						<div
							class="flex justify-between items-center space-x-4 rounded-md border p-4"
						>
							<p class="truncate">{file.file.name}</p>
							<div class="flex gap-2">
								<Button
									variant="destructive"
									on:click={() => removeFile(file)}
								>
									<Trash2 />
								</Button>
								<Button
									on:click={() =>
										openFile(folder.name, file.file.name)}
								>
									<Eye />
								</Button>
							</div>
						</div>
					{/each}
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button
						variant="destructive"
						on:click={() => removeFolder(folder.name)}
						>Delete All</Button
					>
				</Card.Footer>
			</Card.Root>
		{/each}
	{:else}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			No files available...
		</h4>
	{/if}
</div>
