<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Dialog from "$lib/components/ui/dialog";
	import { supabase } from "$lib/supabaseClient";
	import { Download, Eye } from "lucide-svelte";

	let kpsFolders = data.kpsFolders;
	let kpsFiles = data.kpsFiles;

	const kpsFilesBucket = "kps-files";
	let deletedFileNames = [] as string[];

	const openFile = async (folderName: string, fileName: string) => {
		const { data } = await supabase.storage
			.from(kpsFilesBucket)
			.getPublicUrl(`${folderName}/${fileName}`);

		window.open(data.publicUrl);
	};

	const downloadFile = async (folderName: string, fileName: string) => {
		const { data } = await supabase.storage
			.from(kpsFilesBucket)
			.getPublicUrl(`${folderName}/${fileName}`, { download: true });

		window.open(data.publicUrl);
	};

	const removeFolder = async (folderName: string) => {
		const filesToBeDeleted = kpsFiles.filter(
			(f: { folder: string }) => f.folder === folderName
		);
		filesToBeDeleted.map(
			(file: { folder: string; file: { name: string } }) => {
				deletedFileNames = [
					...deletedFileNames,
					`${file.folder}/${file.file.name}`,
				];
			}
		);

		if (deletedFileNames.length > 0) {
			await supabase.storage
				.from(kpsFilesBucket)
				.remove(deletedFileNames);
		}
		deletedFileNames = [];

		kpsFiles = kpsFiles.filter(
			(f: { folder: string }) => f.folder !== folderName
		);
		kpsFolders = kpsFolders?.filter(
			(folder: { name: string }) => folder.name !== folderName
		);
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#if kpsFolders && kpsFolders.length > 0}
		{#each kpsFolders as folder}
			<Card.Root>
				<Card.Header>
					<Card.Title class="truncate">{folder.name}</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{@const f = kpsFiles.filter(
						(f) => f.folder === folder.name
					)}
					{#if f.length <= 3}
						{#each f as file}
							<div
								class="flex justify-between items-center space-x-4 rounded-md border p-4"
							>
								<p
									class="leading-7 [&:not(:first-child)]:mt-6 truncate"
								>
									{file.file.name}
								</p>
								<div class="flex gap-2">
									<Button
										variant="secondary"
										on:click={() =>
											downloadFile(
												folder.name,
												file.file.name
											)}
									>
										<Download />
									</Button>
									<Button
										on:click={() =>
											openFile(
												folder.name,
												file.file.name
											)}
									>
										<Eye />
									</Button>
								</div>
							</div>
						{/each}
					{:else}
						{#each f as file, i}
							{#if i < 2}
								<div
									class="flex justify-between items-center space-x-4 rounded-md border p-4"
								>
									<p
										class="leading-7 [&:not(:first-child)]:mt-6 truncate"
									>
										{file.file.name}
									</p>
									<div class="flex gap-2">
										<Button
											variant="secondary"
											on:click={() =>
												downloadFile(
													folder.name,
													file.file.name
												)}
										>
											<Download />
										</Button>
										<Button
											on:click={() =>
												openFile(
													folder.name,
													file.file.name
												)}
										>
											<Eye />
										</Button>
									</div>
								</div>
							{/if}
						{/each}
						<Dialog.Root>
							<Dialog.Trigger
								class={buttonVariants({ variant: "outline" })}
							>
								{f.length - 2} more files
							</Dialog.Trigger>
							<Dialog.Content>
								{#each f as file, i}
									{#if i >= 2}
										<div
											class="flex justify-between items-center space-x-4 rounded-md border p-4 max-w-[435px]"
										>
											<p
												class="leading-7 [&:not(:first-child)]:mt-6 truncate"
											>
												{file.file.name}
											</p>
											<div class="flex gap-2">
												<Button
													variant="secondary"
													on:click={() =>
														downloadFile(
															folder.name,
															file.file.name
														)}
												>
													<Download />
												</Button>
												<Button
													on:click={() =>
														openFile(
															folder.name,
															file.file.name
														)}
												>
													<Eye />
												</Button>
											</div>
										</div>
									{/if}
								{/each}
							</Dialog.Content>
						</Dialog.Root>
					{/if}
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
