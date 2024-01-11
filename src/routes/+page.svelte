<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import FilePond from "svelte-filepond";
	import { Toaster, toast } from "svelte-sonner";

	const supabase = data.supabase;

	async function handleProcessFile(
		fieldName,
		file,
		metadata,
		load,
		err,
		progress,
		abort,
		transfer,
		options
	) {
		const { data, error } = await supabase.storage
			.from("files")
			.upload(file.name, file);
		if (error) {
			toast.error(`Sorry, there was an error! ${error.message}.`);
		} else {
			load();
		}
	}
</script>

<FilePond
	server={{ process: handleProcessFile }}
	allowMultiple={true}
	instantUpload={false}
/>
<Toaster richColors position="bottom-center" />
