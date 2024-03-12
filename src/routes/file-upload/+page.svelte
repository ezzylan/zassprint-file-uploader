<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";

	import { Loader2 } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { fileUploadFormSchema } from "./schema";

	let formSubmitting = false,
		dialogOpen = false;

	const form = superForm(data.form, {
		validators: zodClient(fileUploadFormSchema),
		onSubmit() {
			formSubmitting = true;
		},
		onUpdated({ form }) {
			formSubmitting = false;

			if (form.valid) {
				dialogOpen = true;
			} else {
				toast.error("Sorry, there was an error!");
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<h2>Upload your files here</h2>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} required />
		</Form.Control>
		<Form.Description>
			Just a short name for us to identify you.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="files">
		<Form.Control let:attrs>
			<Form.Label>Files</Form.Label>
			<Input
				{...attrs}
				on:input={(e) =>
					($formData.files = Array.from(e.currentTarget.files ?? []))}
				type="file"
				multiple
				required
			/>
		</Form.Control>
		<Form.Description>
			Must not exceed 50MB. Preferably in PDF format.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="notes">
		<Form.Control let:attrs>
			<Form.Label>Notes</Form.Label>
			<Textarea
				{...attrs}
				bind:value={$formData.notes}
				class="resize-none"
			/>
		</Form.Control>
		<Form.Description>
			Add any additional notes here. (number of copies, black/white or
			color, etc.)
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4" disabled={formSubmitting}>
		{#if formSubmitting}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />Submitting...
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>

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
