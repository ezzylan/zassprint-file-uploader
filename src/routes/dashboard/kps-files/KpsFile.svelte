<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { supabase } from "$lib/supabaseClient";
	import { Download, Eye } from "lucide-svelte";

	export let customer: any,
		file: any,
		isHiddenFile = false;

	const width = isHiddenFile ? "max-w-[450px]" : "";

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

	<div class="flex gap-2">
		<Button
			variant="secondary"
			on:click={() => downloadFile(customer.name, file.file.name)}
		>
			<Download />
		</Button>
		<Button on:click={() => openFile(customer.name, file.file.name)}>
			<Eye />
		</Button>
	</div>
</div>
