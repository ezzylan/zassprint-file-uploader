<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import Uppy from "@uppy/core";
	import Dashboard from "@uppy/dashboard";
	import { onMount } from "svelte";
	import { Toaster, toast } from "svelte-sonner";

	import "@uppy/core/dist/style.min.css";
	import "@uppy/dashboard/dist/style.min.css";

	const supabase = data.supabase;

	onMount(() => {
		const uppy = new Uppy().use(Dashboard, {
			inline: true,
			target: "#uppy-dashboard",
			showProgressDetails: true,
			proudlyDisplayPoweredByUppy: true,
		});

		uppy.on("complete", (result) => {
			result.successful.map(async (file) => {
				const { data, error } = await supabase.storage
					.from("files")
					.upload(file.name, file.data);
			});
			if (result.failed.length > 0) {
				toast.error("Sorry, there was an error! Please try again");
			} else {
				toast.success("Your files have been successfully uploaded!");
			}
		});
	});
</script>

<div id="uppy-dashboard"></div>
<Toaster richColors position="bottom-center" />
