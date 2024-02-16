<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tabs from "$lib/components/ui/tabs";
	import { AlertCircle, ChevronDown } from "lucide-svelte";

	const currRoute = $page.route.id;
	let currTab = currRoute?.split("/").pop() ?? "kps-files";
</script>

<div class="flex justify-between">
	<h2
		class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Dashboard
	</h2>
	<Tabs.Root
		bind:value={currTab}
		onValueChange={(val) => goto(`/dashboard/${val}`)}
		class="hidden sm:block"
	>
		<Tabs.List>
			<Tabs.Trigger value="kps-files">KPS Files</Tabs.Trigger>
			<Tabs.Trigger value="thesis-orders">Thesis Orders</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]} class="sm:hidden">
				<ChevronDown />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.RadioGroup
				bind:value={currTab}
				onValueChange={(val) => goto(`/dashboard/${val}`)}
			>
				<DropdownMenu.RadioItem value="kps-files">
					KPS Files
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="thesis-orders">
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

<slot />
