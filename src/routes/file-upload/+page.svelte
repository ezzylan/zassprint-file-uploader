<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";

	import { Loader2, X } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { fileUploadFormSchema } from "./schema";

	let dialogOpen = false;

	const form = superForm(data.form, {
		validators: zodClient(fileUploadFormSchema),
		dataType: "json",
		onUpdated({ form }) {
			if (form.valid) {
				dialogOpen = true;
			} else {
				toast.error("Sorry, there was an error!");
			}
		},
	});

	const { form: formData, enhance, delayed } = form;

	const insertNote = (e: Event, file: File) => {
		if ($formData.notes) {
			const targetObj = $formData.notes.find(
				(obj) => obj.file === file.name
			);

			if (targetObj) {
				if (e.currentTarget?.value === "") {
					$formData.notes = $formData.notes.filter(
						(n) => n.file !== file.name
					);
				} else {
					targetObj.note = e.currentTarget?.value;
				}
			} else {
				$formData.notes = [
					...$formData.notes,
					{
						file: file.name,
						note: e.currentTarget?.value,
					},
				];
			}
		} else {
			$formData.notes = [
				{
					file: file.name,
					note: e.currentTarget?.value,
				},
			];
		}
	};
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
				type="file"
				multiple
				on:input={(e) => {
					if ($formData.files.length > 0) {
						$formData.files = [
							...$formData.files,
							...Array.from(e.currentTarget.files ?? []),
						];
					} else {
						$formData.files = Array.from(
							e.currentTarget.files ?? []
						);
					}
				}}
			/>
		</Form.Control>
		<Card.Root class="pt-5 bg-muted">
			{#if $formData.files.length > 0}
				<Card.Content
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				>
					{#each $formData.files as file}
						<Card.Root class="pt-5">
							<Card.Content class="flex flex-col gap-4">
								<div
									class="flex justify-between items-center gap-4"
								>
									<p class="font-medium truncate">
										{file.name}
									</p>
									<Button
										variant="destructive"
										size="icon"
										class="relative h-8 w-8 p-0"
										on:click={() => {
											$formData.files =
												$formData.files.filter(
													(f) => f.name !== file.name
												);
										}}
									>
										<X />
									</Button>
								</div>
								<Textarea
									placeholder="Type your notes here. (number of copies, black/white or color, etc.)"
									class="resize-none"
									on:change={(e) => insertNote(e, file)}
								/>
							</Card.Content>
						</Card.Root>
					{/each}
				</Card.Content>
			{:else}
				<Card.Content>
					<p class="text-sm text-muted-foreground text-center">
						No files to be uploaded...
					</p>
				</Card.Content>
			{/if}
		</Card.Root>
		<Form.Description>
			Each file must not exceed 50MB. Preferably in PDF format.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex justify-end">
		<Form.Button class="mt-4" disabled={$delayed}>
			{#if $delayed}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />Submitting...
			{:else}
				Submit
			{/if}
		</Form.Button>
	</div>
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
