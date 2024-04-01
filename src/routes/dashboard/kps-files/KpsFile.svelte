<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { supabase } from "$lib/supabaseClient";
	import { Ellipsis } from "lucide-svelte";

	export let customer: any,
		file: any,
		isHiddenFile = false;

	const width = isHiddenFile ? "max-w-[450px]" : "";
	const targetObj = customer.notes?.find(
		(obj: { file: any }) => obj.file === file.file.name
	);

	const openFile = async (folderName: string, fileName: string) => {
		const { data } = await supabase.storage
			.from("kps-files")
			.getPublicUrl(`${folderName}/${fileName}`);

		window.open(data.publicUrl);
	};

	const downloadFile = async (folderName: string, fileName: string) => {
		const { data } = await supabase.storage
			.from("kps-files")
			.getPublicUrl(`${folderName}/${fileName}`, { download: true });

		window.open(data.publicUrl);
	};
</script>

<div
	class={`flex justify-between items-center space-x-4 rounded-md border p-4 ${width}`}
>
	<p class="truncate">{file.file.name}</p>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				size="icon"
				class="relative w-8 h-8 p-0"
			>
				<Ellipsis class="w-4 h-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="max-w-56">
			{#if targetObj}
				<DropdownMenu.Label>Notes</DropdownMenu.Label>
				<small class="text-sm leading-none px-2">
					{targetObj.note}
				</small>
				<DropdownMenu.Separator />
			{/if}
			<DropdownMenu.Group>
				<DropdownMenu.Item
					on:click={() => openFile(customer.name, file.file.name)}
					>View file
				</DropdownMenu.Item>
				<DropdownMenu.Item
					on:click={() => downloadFile(customer.name, file.file.name)}
				>
					Download file
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
