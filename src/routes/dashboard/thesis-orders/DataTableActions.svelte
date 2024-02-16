<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Separator } from "$lib/components/ui/separator";
	import { MoreHorizontal } from "lucide-svelte";

	export let supabase: any;
	export let id: string;

	const thesisOrdersTable = "thesis-orders";
	let currStatus: string;
	let thesisFilePath: string;
	let dialogOpen = false;

	const getCustomerDetails = async () => {
		const { data, error } = await supabase
			.from(thesisOrdersTable)
			.select()
			.eq("id", id);

		if (data) {
			currStatus = data[0].status;
			const thesisFileUrl = data[0].thesis_file_url;
			thesisFilePath = decodeURIComponent(
				new URL(thesisFileUrl).pathname.split("/").pop()
			);

			return data[0];
		}
	};

	const updateStatus = async (status: string) => {
		const { error } = await supabase
			.from(thesisOrdersTable)
			.update({ status: status })
			.eq("id", id);

		if (error) {
			console.error(error);
		} else {
			location.reload();
		}
	};

	const deleteOrder = async () => {
		await supabase.storage.from("thesis-files").remove([thesisFilePath]);
		const { error } = await supabase
			.from(thesisOrdersTable)
			.delete()
			.eq("id", id);

		if (error) {
			console.error(error);
		} else {
			location.reload();
		}
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
				<MoreHorizontal class="w-4 h-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Status</DropdownMenu.Label>
				<DropdownMenu.RadioGroup
					bind:value={currStatus}
					onValueChange={(value) => updateStatus(value)}
				>
					<DropdownMenu.RadioItem value="pending">
						Pending
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="confirmed">
						Confirmed
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="printed">
						Printed
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="delivered">
						Delivered
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Group>

			<DropdownMenu.Separator />

			<DropdownMenu.Item on:click={() => (dialogOpen = true)}>
				View details
			</DropdownMenu.Item>
			<form id="receiptForm" action="/receipt">
				<input
					type="hidden"
					name="order"
					value={customerDetails.order_no}
				/>
			</form>
			<DropdownMenu.Item
				on:click={() => {
					const form = document.getElementById("receiptForm");
					form?.submit();
				}}
				>View receipt
			</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item
				class={buttonVariants({ variant: "destructive" })}
				on:click={deleteOrder}
				>Delete order
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>
					<h3
						class="scroll-m-20 text-2xl font-semibold tracking-tight"
					>
						{customerDetails.name}
					</h3>
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
