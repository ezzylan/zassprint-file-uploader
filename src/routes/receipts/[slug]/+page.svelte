<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import dayjs from "dayjs";
	import type { PageData } from "./$types";
	export let data: PageData;
	const thesisOrder = data.order[0];
	const today = dayjs().format("DD/MM/YYYY");
</script>

<main class="container py-6">
	<p>Date: {today}</p>
	<p>Receipt No: {thesisOrder.order_no}</p>
	<h4>Customer Information</h4>
	<p>Name: {thesisOrder.name}</p>
	<p>Phone No: {thesisOrder.phone_num}</p>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>No</Table.Head>
				<Table.Head>Item Description</Table.Head>
				<Table.Head>Quantity</Table.Head>
				<Table.Head>No. of Pages</Table.Head>
				<Table.Head>Price</Table.Head>
				<Table.Head>Total</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell>1.</Table.Cell>
				<Table.Cell>Printing Color</Table.Cell>
				<Table.Cell>{thesisOrder.color_pages}</Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell>1.5</Table.Cell>
				<Table.Cell></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>2.</Table.Cell>
				<Table.Cell>Printing Black & White</Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell>0.15</Table.Cell>
				<Table.Cell></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>3.</Table.Cell>
				<Table.Cell>Thesis Hard/Soft Cover</Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell>25</Table.Cell>
				<Table.Cell></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Head>Total</Table.Head>
				<Table.Cell></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Head>Deposit</Table.Head>
				<Table.Cell></Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Head>Balance</Table.Head>
				<Table.Cell></Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>

	<p class="capitalize">Status: {thesisOrder.status}</p>
	<h4>Notes</h4>
	<p>
		Please make payment to the following account and share the receipt
		through email/WhatsApp.
	</p>
	<ul>
		<li>Bank Name: CIMB BANK</li>
		<li>Account Name: ANN WAFA RESOURCES</li>
		<li>Account No: 86-0313-8080</li>
	</ul>
</main>
