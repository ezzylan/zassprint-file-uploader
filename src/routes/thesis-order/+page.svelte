<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Calendar } from "$lib/components/ui/calendar";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import * as Popover from "$lib/components/ui/popover";
	import { Separator } from "$lib/components/ui/separator";
	import { cn } from "$lib/utils";

	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue,
	} from "@internationalized/date";
	import { AlertCircle, CalendarIcon } from "lucide-svelte";
	import { Toaster, toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms/client";
	import { thesisOrderFormSchema } from "./schema";

	const theForm = superForm(data.form, {
		validators: thesisOrderFormSchema,
		taintedMessage: null,
		onSubmit: () => {
			toast.info("Submitting...");
		},
		onResult: ({ result }) => {
			if (result.status === 200)
				toast.success("We have received your order!");
			if (result.status === 400)
				toast.error("Sorry, there was an error!");
		},
	});

	const { form: formStore } = theForm;

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});

	let value: DateValue | undefined = $formStore.collectionDate
		? parseDate($formStore.collectionDate)
		: undefined;

	let placeholder: DateValue = today(getLocalTimeZone()).add({ days: 2 });
</script>

<div class="flex justify-between">
	<h2
		class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Thesis Hard/Softbound
	</h2>

	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
			Price
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
						<li>Grab Service - Based on Grab price</li>
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

<Form.Root
	method="POST"
	form={theForm}
	schema={thesisOrderFormSchema}
	let:config
	enctype="multipart/form-data"
	class="mt-6"
	controlled
>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Full Name</Form.Label>
				<Form.Input required />
				<Form.Description>
					Your full name in capital letters.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="phoneNum">
			<Form.Item>
				<Form.Label>Phone Number</Form.Label>
				<Form.Input type="tel" required />
				<Form.Description>
					Your phone number without dashes and spaces.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="matrixNum">
			<Form.Item>
				<Form.Label>Matrix Number</Form.Label>
				<Form.Input required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {config} name="thesisType">
			<Form.Item>
				<Form.Label>Type of Thesis</Form.Label>
				<Form.Select required>
					<Form.SelectTrigger placeholder="Select thesis type" />
					<Form.SelectContent>
						<Form.SelectItem value="Hard Cover">
							Hard Cover
						</Form.SelectItem>
						<Form.SelectItem value="Soft Cover">
							Soft Cover
						</Form.SelectItem>
						<Form.SelectItem value="Comb Binding">
							Comb Binding
						</Form.SelectItem>
						<Form.SelectItem value="Tape Binding">
							Tape Binding
						</Form.SelectItem>
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="coverColor">
			<Form.Item>
				<Form.Label>Cover Color</Form.Label>
				<Form.Select required>
					<Form.SelectTrigger placeholder="Select cover color" />
					<Form.SelectContent>
						<Form.SelectItem value="Research Report (Navy Blue)">
							Research Report (Navy Blue)
						</Form.SelectItem>
						<Form.SelectItem
							value="Dissertation/Thesis (Dark Red/Maroon)"
						>
							Dissertation/Thesis (Dark Red/Maroon)
						</Form.SelectItem>
						<Form.SelectItem value="Ocean Blue">
							Ocean Blue
						</Form.SelectItem>
					</Form.SelectContent>
				</Form.Select>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {config} name="thesisTitle">
			<Form.Item>
				<Form.Label>Thesis Title</Form.Label>
				<Form.Input required />
				<Form.Description>
					Your thesis title in capital letters.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="faculty">
			<Form.Item>
				<Form.Label>Faculty</Form.Label>
				<Form.Input required />
				<Form.Description>
					Your faculty's full name in capital letters.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="year">
			<Form.Item>
				<Form.Label>Year</Form.Label>
				<Form.Input type="number" min="2024" required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="studyAcronym">
			<Form.Item>
				<Form.Label>Study Acronym</Form.Label>
				<Form.Input required />
				<Form.Description>
					Your study acronym, i.e. PhD, MEngSc.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
		<Form.Field {config} name="colorPages">
			<Form.Item>
				<Form.Label>Number of Color Pages</Form.Label>
				<Form.Input type="number" min="0" required />
				<Form.Description>RM1.50 per page.</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="blackWhitePages">
			<Form.Item>
				<Form.Label>Number of Black & White Pages</Form.Label>
				<Form.Input type="number" min="0" required />
				<Form.Description>RM0.15 per page.</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="copies">
			<Form.Item>
				<Form.Label>Number of Copies</Form.Label>
				<Form.Input type="number" min="0" required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="thesisFile">
			<Form.Item>
				<Form.Label>Upload Your Thesis File Here</Form.Label>
				<Form.Input type="file" required />
				<Form.Description>In PDF format.</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Separator class="my-6" />

	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 mb-3">
		<Form.Field {config} name="collectionDate">
			<Form.Item class="flex flex-col gap-1">
				<Form.Label for="collectionDate">Collection Date</Form.Label>
				<Popover.Root>
					<Form.Control id="collectionDate" let:attrs>
						<Popover.Trigger
							id="collectionDate"
							{...attrs}
							class={cn(
								buttonVariants({ variant: "outline" }),
								"pl-4 justify-start text-left font-normal",
								!value && "text-muted-foreground"
							)}
						>
							{value
								? df.format(value.toDate(getLocalTimeZone()))
								: "Pick a date"}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
						</Popover.Trigger>
					</Form.Control>
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
								if (v) {
									$formStore.collectionDate = v.toString();
								} else {
									$formStore.collectionDate = "";
								}
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description
					>Your thesis will be finished after 2 working days.</Form.Description
				>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="collectionMethod">
			<Form.Item>
				<Form.Label>Collection Method</Form.Label>
				<Form.Select required>
					<Form.SelectTrigger placeholder="Select thesis type" />
					<Form.SelectContent>
						<Form.SelectItem value="Delivery">
							Delivery
						</Form.SelectItem>
						<Form.SelectItem value="Pick Up">
							Pick Up
						</Form.SelectItem>
					</Form.SelectContent>
				</Form.Select>
				<Form.Description>
					Just leave the Address field blank if you selected "Pick
					Up".
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<Form.Field {config} name="address">
		<Form.Item>
			<Form.Label>Address</Form.Label>
			<Form.Textarea class="resize-none" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button class="mt-4">Submit</Form.Button>
</Form.Root>

<Toaster richColors position="top-right" />
