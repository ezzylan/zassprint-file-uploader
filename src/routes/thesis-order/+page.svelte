<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Calendar } from "$lib/components/ui/calendar";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";
	import { Separator } from "$lib/components/ui/separator";
	import { Switch } from "$lib/components/ui/switch";
	import { Textarea } from "$lib/components/ui/textarea";
	import { cn } from "$lib/utils";

	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue,
	} from "@internationalized/date";
	import { AlertCircle, CalendarIcon, Loader2 } from "lucide-svelte";
	import { copyText } from "svelte-copy";
	import { toast } from "svelte-sonner";
	import { superForm, type FormResult } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { thesisOrderFormSchema } from "./schema";

	const form = superForm(data.form, {
		validators: zodClient(thesisOrderFormSchema),
		taintedMessage: null,
		onSubmit: () => {
			formSubmitting = true;
		},
		onResult: (event) => {
			formSubmitting = false;

			const result = event.result as FormResult<ActionData>;
			if (result.type === "success") {
				dialogOpen = true;
				orderNo = result.data?.orderNo as string;
			}
			if (result.type === "failure") {
				toast.error("Sorry, there was an error!");
			}
		},
	});

	const { form: formData, enhance } = form;

	$: selectedThesisType = $formData.thesisType
		? {
				label: $formData.thesisType,
				value: $formData.thesisType,
			}
		: undefined;

	$: selectedCoverColor = $formData.coverColor
		? {
				label: $formData.coverColor,
				value: $formData.coverColor,
			}
		: undefined;

	$: selectedCdLabel = $formData.cdLabel
		? {
				label: $formData.cdLabel,
				value: $formData.cdLabel,
			}
		: undefined;

	$: selectedCollectionMethod = $formData.collectionMethod
		? {
				label: $formData.collectionMethod,
				value: $formData.collectionMethod,
			}
		: undefined;

	const df = new DateFormatter("en-US", { dateStyle: "long" });

	let value: DateValue | undefined = $formData.collectionDate
		? parseDate($formData.collectionDate)
		: undefined;

	let placeholder: DateValue = today(getLocalTimeZone()).add({ days: 2 });

	let cdBurn = false,
		addressDisabled = false,
		dialogOpen = false,
		orderNo: string,
		formSubmitting = false;

	$: cdDisabled = cdBurn ? "grid" : "hidden";
</script>

<div class="flex justify-between">
	<h2>Thesis Hard/Softbound</h2>

	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: "destructive" })}>
			<span class="sm:hidden">Pricing</span>
			<span class="hidden sm:block">Click Here for Pricing</span>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Price List</Dialog.Title>
				<Dialog.Description>
					<ul>
						<li>B&W - RM0.15/page</li>
						<li>Color - RM1.50/page</li>
						<li>Hard/Soft Binding - RM25/book</li>
						<li>CD Burn & Label - RM10/piece or RM5/piece</li>
						<li>Delivery Service - Based on Grab delivery price</li>
						<li>*can request for other courier services</li>
					</ul>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
</div>

<Alert.Root class="mt-6 bg-sky-300">
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>Thesis Order Process</Alert.Title>
	<Alert.Description>
		<ul class="list-decimal list-inside">
			<li>Complete the online form.</li>
			<li>Receive a confirmation receipt.</li>
			<li>Submit a deposit payment.</li>
			<li>Your thesis processing begins upon payment.</li>
			<li>
				Choose pickup or opt for delivery (Express delivery/Shipping).
			</li>
			<li>Receive your thesis and make the final balance payment.</li>
		</ul>
	</Alert.Description>
</Alert.Root>

<form method="POST" enctype="multipart/form-data" class="mt-6" use:enhance>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Full Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} required />
			</Form.Control>
			<Form.Description>Your full name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="phoneNum">
			<Form.Control let:attrs>
				<Form.Label>Phone Number</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.phoneNum}
					type="tel"
					required
				/>
			</Form.Control>
			<Form.Description>
				Your phone number without dashes and spaces.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="matrixNum">
			<Form.Control let:attrs>
				<Form.Label>Matrix Number</Form.Label>
				<Input {...attrs} bind:value={$formData.matrixNum} required />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {form} name="thesisType">
			<Form.Control let:attrs>
				<Form.Label>Type of Thesis</Form.Label>
				<Select.Root
					selected={selectedThesisType}
					onSelectedChange={(v) => {
						v && ($formData.thesisType = v.value);
					}}
					required
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select thesis type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Hard Cover">Hard Cover</Select.Item>
						<Select.Item value="Soft Cover">Soft Cover</Select.Item>
						<Select.Item value="Comb Binding">
							Comb Binding
						</Select.Item>
						<Select.Item value="Tape Binding">
							Tape Binding
						</Select.Item>
					</Select.Content>
				</Select.Root>
				<input
					hidden
					bind:value={$formData.thesisType}
					name={attrs.name}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="coverColor">
			<Form.Control let:attrs>
				<Form.Label>Cover Color</Form.Label>
				<Select.Root
					selected={selectedCoverColor}
					onSelectedChange={(v) => {
						v && ($formData.coverColor = v.value);
					}}
					required
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select cover color" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Research Report (Navy Blue)">
							Research Report (Navy Blue)
						</Select.Item>
						<Select.Item
							value="Dissertation/Thesis (Dark Red/Maroon)"
						>
							Dissertation/Thesis (Dark Red/Maroon)
						</Select.Item>
						<Select.Item value="Ocean Blue">Ocean Blue</Select.Item>
						<Select.Item value="Plastic Cover">
							Plastic Cover
						</Select.Item>
					</Select.Content>
				</Select.Root>
				<input
					hidden
					bind:value={$formData.coverColor}
					name={attrs.name}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {form} name="thesisTitle">
			<Form.Control let:attrs>
				<Form.Label>Thesis Title</Form.Label>
				<Input {...attrs} bind:value={$formData.thesisTitle} required />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="faculty">
			<Form.Control let:attrs>
				<Form.Label>Faculty</Form.Label>
				<Input {...attrs} bind:value={$formData.faculty} required />
			</Form.Control>
			<Form.Description>Your faculty's full name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="year">
			<Form.Control let:attrs>
				<Form.Label>Year</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.year}
					type="number"
					min="2024"
					required
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="studyAcronym">
			<Form.Control let:attrs>
				<Form.Label>Study Acronym</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.studyAcronym}
					required
				/>
			</Form.Control>
			<Form.Description>
				Your study acronym, i.e. PhD, MEngSc.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {form} name="colorPages">
			<Form.Control let:attrs>
				<Form.Label>Number of Color Pages</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.colorPages}
					type="number"
					min="0"
					required
				/>
			</Form.Control>
			<Form.Description>RM1.50 per page.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="blackWhitePages">
			<Form.Control let:attrs>
				<Form.Label>Number of Black & White Pages</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.blackWhitePages}
					type="number"
					min="0"
					required
				/>
			</Form.Control>
			<Form.Description>RM0.15 per page.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="copies">
			<Form.Control let:attrs>
				<Form.Label>Number of Copies</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.copies}
					type="number"
					min="1"
					required
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="thesisFile">
			<Form.Control let:attrs>
				<Form.Label>Upload Your Thesis File Here</Form.Label>
				<Input
					{...attrs}
					accept="application/pdf"
					on:input={(e) =>
						($formData.thesisFile =
							e.currentTarget.files?.item(0) ?? null)}
					type="file"
					required
				/>
			</Form.Control>
			<Form.Description>In PDF format only.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<Form.Field {form} name="cdBurn">
		<Form.Control let:attrs>
			<div class="flex items-center space-x-2">
				<Switch
					includeInput
					{...attrs}
					bind:checked={$formData.cdBurn}
					onCheckedChange={() => (cdBurn = !cdBurn)}
				/>
				<Form.Label>CD Burn</Form.Label>
			</div>
		</Form.Control>
	</Form.Field>

	<div class={`${cdDisabled} grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 pt-4`}>
		<Form.Field {form} name="cdLabel">
			<Form.Control let:attrs>
				<Form.Label>CD Label</Form.Label>
				<Select.Root
					selected={selectedCdLabel}
					onSelectedChange={(v) => {
						v && ($formData.cdLabel = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select CD label" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Sticker Label">
							Sticker Label
						</Select.Item>
						<Select.Item value="Paper Label">
							Paper Label
						</Select.Item>
					</Select.Content>
				</Select.Root>
				<input
					hidden
					bind:value={$formData.cdLabel}
					name={attrs.name}
				/>
			</Form.Control>
			<Form.Description>
				Sticker label (RM10/pc), paper label (RM5/pc).
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="cdCopies">
			<Form.Control let:attrs>
				<Form.Label>Number of CD Copies</Form.Label>
				<Input
					{...attrs}
					bind:value={$formData.cdCopies}
					type="number"
					min="0"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 mb-3">
		<Form.Field {form} name="collectionDate" class="flex flex-col gap-1">
			<Form.Control let:attrs>
				<Form.Label for="collectionDate">Collection Date</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...attrs}
						class={cn(
							buttonVariants({ variant: "outline" }),
							"justify-start pl-4 text-left font-normal",
							!value && "text-muted-foreground"
						)}
					>
						{value
							? df.format(value.toDate(getLocalTimeZone()))
							: "Pick a date"}
						<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							bind:value
							bind:placeholder
							minValue={today(getLocalTimeZone()).add({
								days: 2,
							})}
							calendarLabel="Collection date"
							initialFocus
							onValueChange={(v) => {
								$formData.collectionDate = v
									? v.toString()
									: "";
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description
					>Your thesis will be finished after 2 working days.</Form.Description
				>
				<Form.FieldErrors />
				<input
					hidden
					value={$formData.collectionDate}
					name={attrs.name}
				/>
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="collectionMethod">
			<Form.Control let:attrs>
				<Form.Label>Collection Method</Form.Label>
				<Select.Root
					required
					selected={selectedCollectionMethod}
					onSelectedChange={(v) => {
						if (v) {
							$formData.collectionMethod = v.value;
							addressDisabled =
								v.value === "Pick Up" ? true : false;
						}
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select thesis type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Delivery">Delivery</Select.Item>
						<Select.Item value="Pick Up">Pick Up</Select.Item>
					</Select.Content>
				</Select.Root>
				<input
					hidden
					bind:value={$formData.collectionMethod}
					name={attrs.name}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Field {form} name="address">
		<Form.Control let:attrs>
			<Form.Label>Address</Form.Label>
			<Textarea
				{...attrs}
				placeholder="Write your full address here..."
				class="resize-none"
				bind:value={$formData.address}
				disabled={addressDisabled}
			/>
		</Form.Control>
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

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>We have received your order!</AlertDialog.Title>
			<AlertDialog.Description>
				Here's your order number: #{orderNo}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>OK</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					copyText(orderNo);
					toast.success("Order number copied!");
				}}
			>
				Copy Order Number
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
