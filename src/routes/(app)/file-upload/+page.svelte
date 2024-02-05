<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import type { FormOptions } from "formsnap";
	import { toast, Toaster } from "svelte-sonner";
	import { fileUploadFormSchema, type FormSchema } from "./schema";

	const options: FormOptions<FormSchema> = {
		onSubmit() {
			toast.loading("Submitting...");
		},
		onResult({ result }) {
			if (result.status === 200) {
				dialogOpen = true;
			}
			if (result.status === 400) {
				toast.error("Sorry, there was an error!");
			}
		},
	};

	let dialogOpen = false;
</script>

<h2
	class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
	Upload your files here
</h2>

<Form.Root
	method="POST"
	form={data.form}
	{options}
	schema={fileUploadFormSchema}
	let:config
	enctype="multipart/form-data"
>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input required />
			<Form.Description>
				Just a short name for us to identify you.
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="files">
		<Form.Item>
			<Form.Label>Files</Form.Label>
			<Form.Input type="file" multiple required />
			<Form.Description>
				Must not exceed 50MB. Preferably in PDF format.
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button class="mt-4">Submit</Form.Button>
</Form.Root>

<Toaster richColors position="top-right" />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="bg-green-300">
		<Dialog.Header>
			<Dialog.Title>Successfully uploaded!</Dialog.Title>
			<Dialog.Description>
				Please inform our staff that you have uploaded your files.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
