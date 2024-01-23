<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Form from "$lib/components/ui/form";
	import type { FormOptions } from "formsnap";
	import { toast, Toaster } from "svelte-sonner";
	import { formSchema, type FormSchema } from "./schema";

	const options: FormOptions<FormSchema> = {
		onSubmit() {
			toast.info("Submitting...");
		},
		onResult({ result }) {
			if (result.status === 200)
				toast.success("Your files have been successfully uploaded!");
			if (result.status === 400)
				toast.error("Sorry, there was an error!");
		},
	};
</script>

<h2 class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight first:mt-0">
	Upload your files here
</h2>

<Form.Root
	method="POST"
	form={data.form}
	{options}
	schema={formSchema}
	let:config
	enctype="multipart/form-data"
>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input required />
			<Form.Description
				>Just a short name for us to identify you.</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="files">
		<Form.Item>
			<Form.Label>Files</Form.Label>
			<Form.Input type="file" multiple required />
			<Form.Description>Preferably in PDF format.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button class="mt-4">Submit</Form.Button>
</Form.Root>

<Toaster richColors position="top-right" />
