<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Label } from "$lib/components/ui/label";
	import * as Popover from "$lib/components/ui/popover";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Switch } from "$lib/components/ui/switch";
	import { supabase } from "$lib/supabaseClient";
	import { Info } from "lucide-svelte";
	import KpsFile from "./KpsFile.svelte";

	let { kpsCustomers } = data,
		kpsFiles: any[] = [],
		deletedFiles: string[] = [];

	data.getKpsFiles.then((files) => (kpsFiles = files));

	const deleteFiles = async (customerName: string) => {
		const filesToBeDeleted = kpsFiles.filter(
			(f: { customer: string }) => f.customer === customerName
		);
		filesToBeDeleted.map(
			(file: { customer: string; file: { name: string } }) => {
				deletedFiles = [
					...deletedFiles,
					`${file.customer}/${file.file.name}`,
				];
			}
		);

		await supabase.from("file_uploads").delete().eq("name", customerName);
		await supabase.storage.from("kps-files").remove(deletedFiles);

		deletedFiles = [];
		kpsFiles = kpsFiles.filter(
			(f: { customer: string }) => f.customer !== customerName
		);
		kpsCustomers = kpsCustomers.filter(
			(customer: { name: string }) => customer.name !== customerName
		);
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#await data.getKpsFiles}
		{#each Array(3) as _}
			<Card.Root>
				<Card.Header>
					<Skeleton class="h-5 w-40" />
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{#each Array(2) as _}
						<Skeleton class="h-[72px]" />
					{/each}
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Skeleton class="h-11 w-[105px] rounded-md" />
				</Card.Footer>
			</Card.Root>
		{/each}
	{:then kpsFiles}
		{#if kpsCustomers.length > 0}
			{#each kpsCustomers as customer}
				<Card.Root>
					<Card.Header
						class="flex flex-row justify-between items-center"
					>
						<Card.Title>{customer.name}</Card.Title>
						{#if customer.notes}
							<Popover.Root>
								<Popover.Trigger>
									<Info size="20" />
								</Popover.Trigger>
								<Popover.Content>
									{customer.notes}
								</Popover.Content>
							</Popover.Root>
						{/if}
					</Card.Header>
					<Card.Content class="flex flex-col gap-4">
						{@const f = kpsFiles.filter(
							(f) => f.customer === customer.name
						)}
						{#if f.length <= 3}
							{#each f as file}
								<KpsFile {customer} {file} />
							{/each}
						{:else}
							{#each f as file, i}
								{#if i < 2}
									<KpsFile {customer} {file} />
								{/if}
							{/each}
							<Dialog.Root>
								<Dialog.Trigger
									class={buttonVariants({
										variant: "outline",
									})}
								>
									{f.length - 2} more files
								</Dialog.Trigger>
								<Dialog.Content>
									{#each f as file, i}
										{#if i >= 2}
											<KpsFile {customer} {file} />
										{/if}
									{/each}
								</Dialog.Content>
							</Dialog.Root>
						{/if}
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<div class="flex items-center space-x-2">
							<Switch
								id="printStatus"
								checked={customer.print_status}
								onCheckedChange={async (value) => {
									await supabase
										.from("file_uploads")
										.update({ print_status: value })
										.eq("name", customer.name);
								}}
							/>
							<Label for="printStatus">Done</Label>
						</div>
						<Button
							variant="destructive"
							on:click={() => deleteFiles(customer.name)}
							>Delete</Button
						>
					</Card.Footer>
				</Card.Root>
			{/each}
		{:else}
			<h4>No files available...</h4>
		{/if}
	{/await}
</div>
