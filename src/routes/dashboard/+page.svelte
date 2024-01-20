<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import dayjs from "dayjs";
	import { AlertCircle } from "lucide-svelte";
	import { Reload } from "radix-icons-svelte";
	import { onMount } from "svelte";
	import Time from "svelte-time";

	const supabase = data.supabase;
	let files: any[];
	let deletedFileNames: string[];
	let isRefreshing = true;

	function getFiles() {
		files = [];
		deletedFileNames = [];
		const now = dayjs();

		setTimeout(async () => {
			const { data, error } = await supabase.storage
				.from("files")
				.list("", { sortBy: { column: "created_at", order: "desc" } });

			if (data) {
				data.map((file) => (files = [...files, file]));
			}

			files.map((file) => {
				const fileCreatedTime = dayjs(file.created_at);

				if (now.isAfter(fileCreatedTime, "hour")) {
					deletedFileNames = [...deletedFileNames, file.name];
					files = files.filter((f) => f != file);
				}
			});

			if (deletedFileNames.length > 0) {
				const { data, error } = await supabase.storage
					.from("files")
					.remove(deletedFileNames);

				if (error) {
					console.log(error);
				}
			}

			isRefreshing = false;
		}, 1000);
		deletedFileNames = [];
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
		Click the "Refresh" button to check for new files.
	</Alert.Description>
</Alert.Root>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#if isRefreshing}
		{#each Array(3) as _}
			<Card.Root>
				<Card.Header>
					<Skeleton class="w-[300px] h-[20px]" />
				</Card.Header>
				<Card.Content class="flex justify-between">
					<Skeleton class="w-[200px] h-[20px]" />
					<Skeleton class="w-[80px] h-[20px]" />
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Skeleton class="w-[75px] h-10 rounded-md" />
					<div class="flex gap-2">
						<Skeleton class="w-[65px] h-10 rounded-md" />
						<Skeleton class="w-[100px] h-10 rounded-md" />
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	{:else if files && files.length > 0}
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
