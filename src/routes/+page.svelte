<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { ClipboardType, FileUp } from "lucide-svelte";
</script>

<h2 class="scroll-m-20 pb-8 text-3xl font-semibold tracking-tight first:mt-0">
	What do you want to do?
</h2>

<div class="flex flex-col gap-3 items-center">
	<Button variant="outline" href="/file-upload" class="h-auto p-10">
		<div class="flex flex-col gap-3 items-center">
			<FileUp class="h-20 w-20" />
			<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
				KPS File Uploader
			</h4>
		</div>
	</Button>
	<Button variant="outline" class="h-auto p-10" disabled>
		<div class="flex flex-col gap-3 items-center">
			<ClipboardType class="h-20 w-20" />
			<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
				Thesis Order Form
			</h4>
			<p class="text-sm text-muted-foreground">Coming soon</p>
		</div>
	</Button>
</div>
