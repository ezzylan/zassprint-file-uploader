<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Download } from "lucide-svelte";
	export let thesis_file_url: string;
</script>

<Button on:click={() => window.open(thesis_file_url)}><Download /></Button>
