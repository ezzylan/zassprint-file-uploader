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

		uppy.on("complete", async (result) => {
			const files = [];

			for (const file of result.successful) {
				const { data, error } = await supabase.storage
					.from("files")
					.upload(file.name, file.data);
				if (error) {
					toast.error("Sorry, there was an error! Please try again.");
					break;
				}
				files.push(data);
			}

			if (files.length == result.successful.length) {
				toast.success("Your files have been successfully uploaded!");
			}
		});
	});
</script>

<div id="uppy-dashboard"></div>
<Toaster richColors position="bottom-center" />
