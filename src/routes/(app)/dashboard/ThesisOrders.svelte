<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import * as Table from "$lib/components/ui/table";

	import { ArrowUpDown } from "lucide-svelte";
	import {
		Render,
		Subscribe,
		createRender,
		createTable,
	} from "svelte-headless-table";
	import {
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter,
	} from "svelte-headless-table/plugins";
	import { readable } from "svelte/store";
	import DataTableActions from "./DataTableActions.svelte";
	import DataTableCheckbox from "./DataTableCheckbox.svelte";
	import DataTableDownloadButton from "./DataTableDownloadButton.svelte";

	export let supabase: any;
	export let thesisOrders;

	const table = createTable(readable(thesisOrders), {
		page: addPagination(),
		sort: addSortBy({ disableMultiSort: true }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) =>
				value.toLowerCase().includes(filterValue.toLowerCase()),
		}),
		select: addSelectedRows(),
	});

	const columns = table.createColumns([
		// table.column({
		// 	accessor: "id",
		// 	header: (_, { pluginStates }) => {
		// 		const { allPageRowsSelected } = pluginStates.select;
		// 		return createRender(DataTableCheckbox, {
		// 			checked: allPageRowsSelected,
		// 		});
		// 	},
		// 	cell: ({ row }, { pluginStates }) => {
		// 		const { getRowState } = pluginStates.select;
		// 		const { isSelected } = getRowState(row);
		// 		return createRender(DataTableCheckbox, {
		// 			checked: isSelected,
		// 		});
		// 	},
		// 	plugins: {
		// 		sort: { disable: true },
		// 		filter: { exclude: true },
		// 	},
		// }),
		table.column({
			accessor: "order_no",
			header: "Order No",
			plugins: {
				filter: { exclude: true },
			},
		}),
		table.column({
			accessor: "name",
			header: "Name",
		}),
		table.column({
			accessor: "status",
			header: "Status",
		}),
		table.column({
			accessor: "thesis_file_url",
			header: "Thesis File",
			cell: ({ value }) => {
				return createRender(DataTableDownloadButton, {
					thesis_file_url: value,
				});
			},
			plugins: {
				sort: { disable: true },
				filter: { exclude: true },
			},
		}),
		table.column({
			accessor: ({ id }) => id,
			header: "Actions",
			cell: ({ value }) => {
				return createRender(DataTableActions, { supabase, id: value });
			},
			plugins: {
				sort: { disable: true },
			},
		}),
	]);

	const {
		headerRows,
		pageRows,
		tableAttrs,
		tableBodyAttrs,
		pluginStates,
		rows,
	} = table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
</script>

{#if thesisOrders.length > 0}
	<div>
		<div class="flex items-center py-4">
			<Input
				class="max-w-sm"
				placeholder="Filter orders..."
				type="text"
				bind:value={$filterValue}
			/>
		</div>
		<div class="rounded-md border">
			<Table.Root {...$tableAttrs}>
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe
										attrs={cell.attrs()}
										let:attrs
										props={cell.props()}
										let:props
									>
										<Table.Head
											{...attrs}
											class="[&:has([role=checkbox])]:pl-3"
										>
											{#if cell.id === "order_no" || cell.id === "name" || cell.id === "status"}
												<Button
													variant="ghost"
													on:click={props.sort.toggle}
												>
													<Render
														of={cell.render()}
													/>
													<ArrowUpDown
														class={"ml-2 h-4 w-4"}
													/>
												</Button>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
				<Table.Body {...$tableBodyAttrs}>
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row
								{...rowAttrs}
								data-state={$selectedDataIds[row.id] &&
									"selected"}
							>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<div class="ml-4">
												{#if cell.id === "status"}
													<div class="capitalize">
														<Render
															of={cell.render()}
														/>
													</div>
												{:else if cell.id === "order_no"}
													#<Render
														of={cell.render()}
													/>
												{:else}
													<Render
														of={cell.render()}
													/>
												{/if}
											</div>
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<!-- <div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{" "}
			{$rows.length} row(s) selected.
		</div> -->
			<Button
				variant="outline"
				size="sm"
				on:click={() => ($pageIndex = $pageIndex - 1)}
				disabled={!$hasPreviousPage}>Previous</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
			>
		</div>
	</div>
{:else}
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		No orders available...
	</h4>
{/if}
