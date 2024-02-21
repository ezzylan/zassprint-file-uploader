<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	export let data: PageData;

	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";

	import { BookCheck, ClipboardType, FileUp } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm, type FormResult } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { orderStatusFormSchema } from "./schema";

	const form = superForm(data.form, {
		validators: zodClient(orderStatusFormSchema),
		onResult: (event) => {
			const result = event.result as FormResult<ActionData>;
			if (result.type === "success") {
				status = result.data?.status as string;
				toast.success(`Your order is ${status}.`);
			}
		},
	});

	const { form: formData, enhance } = form;
	let dialogOpen = false,
		status: string;
</script>

<h2>What do you want to do?</h2>

<div class="flex flex-col md:flex-row justify-center gap-3 items-center">
	<Button variant="outline" href="/file-upload" class="size-60 p-10">
		<div class="flex flex-col gap-3 items-center">
			<FileUp class="size-20" />
			<h4>KPS File Uploader</h4>
		</div>
	</Button>
	<Button variant="outline" href="/thesis-order" class="size-60 p-10">
		<div class="flex flex-col gap-3 items-center">
			<ClipboardType class="size-20" />
			<h4>Thesis Order Form</h4>
		</div>
	</Button>
	<Button
		variant="outline"
		on:click={() => (dialogOpen = true)}
		class="size-60 p-10"
	>
		<div class="flex flex-col gap-3 items-center">
			<BookCheck class="size-20" />
			<h4 class="text-wrap">Check Thesis Order Status</h4>
		</div>
	</Button>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="pb-4"
				>Enter your order number here:</Dialog.Title
			>
			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="orderNo">
					<Form.Control let:attrs>
						<Input {...attrs} bind:value={$formData.orderNo} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
