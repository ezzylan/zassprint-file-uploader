<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import type { FormOptions } from "formsnap";
	import { BookCheck, ClipboardType, FileUp } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { checkOrderStatusFormSchema, type FormSchema } from "./schema";

	let dialogOpen = false;
	let status: string;

	const options: FormOptions<FormSchema> = {
		onSubmit() {
			toast.loading("Submitting...");
		},
		onResult: ({ result }) => {
			if (result.status === 200) {
				status = result.data.status ? result.data.status : null;
				toast.success(`Your order is ${status}.`);
			}
			if (result.status === 400) {
				toast.error("Sorry, there was an error!");
			}
		},
	};
</script>

<h2
	class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
	What do you want to do?
</h2>

<div class="flex flex-col md:flex-row justify-center gap-3 items-center">
	<Button variant="outline" href="/file-upload" class="size-60 p-10">
		<div class="flex flex-col gap-3 items-center">
			<FileUp class="size-20" />
			<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
				KPS File Uploader
			</h4>
		</div>
	</Button>
	<Button variant="outline" href="/thesis-order" class="size-60 p-10">
		<div class="flex flex-col gap-3 items-center">
			<ClipboardType class="size-20" />
			<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
				Thesis Order Form
			</h4>
		</div>
	</Button>
	<Button
		variant="outline"
		on:click={() => (dialogOpen = true)}
		class="size-60 p-10"
	>
		<div class="flex flex-col gap-3 items-center">
			<BookCheck class="size-20" />
			<h4
				class="scroll-m-20 text-xl font-semibold tracking-tight text-wrap"
			>
				Check Thesis Order Status
			</h4>
		</div>
	</Button>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="pb-4"
				>Enter your order number here:</Dialog.Title
			>
			<Form.Root
				schema={checkOrderStatusFormSchema}
				form={data.form}
				{options}
				let:config
				method="POST"
				class="space-y-4"
			>
				<Form.Field {config} name="orderNo">
					<Form.Item>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</Form.Root>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
