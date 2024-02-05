<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { supabase } from "$lib/supabaseClient";

	import * as Tabs from "$lib/components/ui/tabs";
	import { AlertCircle, ChevronDown } from "lucide-svelte";
	import KpsFiles from "./KpsFiles.svelte";
	import ThesisOrders from "./ThesisOrders.svelte";

	const kpsFolders = data.kpsFolders;
	const kpsFiles = data.kpsFiles;
	const thesisOrders = data.thesisOrders;

	let dashboard = "KPS Files";
</script>

<div class="flex justify-between">
	<h2
		class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Dashboard
	</h2>
	<Tabs.Root bind:value={dashboard} class="hidden sm:block">
		<Tabs.List>
			<Tabs.Trigger value="KPS Files">KPS Files</Tabs.Trigger>
			<Tabs.Trigger value="Thesis Orders">Thesis Orders</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]} class="sm:hidden">
				<ChevronDown />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.RadioGroup bind:value={dashboard}>
				<DropdownMenu.RadioItem value="KPS Files">
					KPS Files
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="Thesis Orders">
					Thesis Orders
				</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

<Alert.Root class="mb-8 bg-sky-300">
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description>
		Refresh the page to check for new files and orders.
	</Alert.Description>
</Alert.Root>

{#if dashboard == "KPS Files"}
	<KpsFiles {supabase} {kpsFolders} {kpsFiles} />
{:else}
	<ThesisOrders {supabase} {thesisOrders} />
{/if}
