<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Separator } from "$lib/components/ui/separator";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import { Ellipsis } from "lucide-svelte";

	export let supabase: SupabaseClient, id: string;

	const statusArr = [
		"Pending",
		"Confirmed",
		"Printed",
		"Delivered",
		"Cancelled",
	];

	let dialogOpen = false,
		alertDialogOpen = false;

	const getCustomerDetails = async () => {
		const { data } = await supabase
			.from("thesis_orders")
			.select()
			.eq("id", id);

		return data ? data[0] : [];
	};

	const updateStatus = async (status: string) => {
		await supabase
			.from("thesis_orders")
			.update({ status: status })
			.eq("id", id);

		location.reload();
	};

	const deleteOrder = async () => {
		await supabase.from("thesis_orders").delete().eq("id", id);
		location.reload();
	};
</script>

{#await getCustomerDetails() then customerDetails}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				variant="ghost"
				builders={[builder]}
				size="icon"
				class="relative w-8 h-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis class="w-4 h-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Status</DropdownMenu.Label>
				<DropdownMenu.RadioGroup
					value={customerDetails.status}
					onValueChange={(value) => {
						if (value) updateStatus(value);
					}}
				>
					{#each statusArr as status}
						<DropdownMenu.RadioItem value={status}>
							{status}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Group>

			<DropdownMenu.Separator />

			<DropdownMenu.Item on:click={() => (dialogOpen = true)}>
				View details
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item
				class={buttonVariants({ variant: "destructive" })}
				on:click={() => (alertDialogOpen = true)}
				>Delete order
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>
					<h3>{customerDetails.name}</h3>
				</Dialog.Title>
			</Dialog.Header>

			<Accordion.Root>
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Customer Information</Accordion.Trigger>
					<Accordion.Content>
						<div
							class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
						>
							<div>
								<div class="text-lg font-semibold">
									Phone Number
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.phone_num}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">
									Matrix Number
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.matrix_num}
								</small>
							</div>
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-2">
					<Accordion.Trigger>Thesis Information</Accordion.Trigger>
					<Accordion.Content>
						<div
							class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
						>
							<div>
								<div class="text-lg font-semibold">
									Type of Thesis
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.thesis_type}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">
									Cover Color
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.cover_color}
								</small>
							</div>
						</div>

						<Separator class="my-6" />

						<div
							class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
						>
							<div>
								<div class="text-lg font-semibold">
									Thesis Title
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.thesis_title}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">Faculty</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.faculty}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">Year</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.year}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">
									Study Acronym
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.study_acronym}
								</small>
							</div>
						</div>

						<Separator class="my-6" />

						<div
							class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"
						>
							<div>
								<div class="text-lg font-semibold">
									Color Pages
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.color_pages}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">
									B&W Pages
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.black_white_pages}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">Copies</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.copies}
								</small>
							</div>
						</div>

						{#if customerDetails.cd_label}
							<Separator class="my-6" />

							<div
								class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
							>
								<div>
									<div class="text-lg font-semibold">
										CD Label
									</div>
									<small
										class="text-sm font-medium leading-none"
									>
										{customerDetails.cd_label}
									</small>
								</div>
								<div>
									<div class="text-lg font-semibold">
										CD Copies
									</div>
									<small
										class="text-sm font-medium leading-none"
									>
										{customerDetails.cd_copies}
									</small>
								</div>
							</div>
						{/if}
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item value="item-3">
					<Accordion.Trigger>Delivery Information</Accordion.Trigger>
					<Accordion.Content>
						<div
							class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4"
						>
							<div>
								<div class="text-lg font-semibold">
									Collection Date
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.collection_date}
								</small>
							</div>
							<div>
								<div class="text-lg font-semibold">
									Collection Method
								</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.collection_method}
								</small>
							</div>
						</div>

						{#if customerDetails.address}
							<div class="mt-2 sm:mt-4">
								<div class="text-lg font-semibold">Address</div>
								<small class="text-sm font-medium leading-none">
									{customerDetails.address}
								</small>
							</div>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Dialog.Content>
	</Dialog.Root>
{/await}

<AlertDialog.Root bind:open={alertDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the
				order from the database.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class={buttonVariants({ variant: "destructive" })}
				on:click={deleteOrder}
			>
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
