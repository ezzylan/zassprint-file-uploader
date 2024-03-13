<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Eye } from "lucide-svelte";
	export let order_no: string;
</script>

<form id={`receiptForm#${order_no}`} action="/receipt">
	<input type="hidden" name="order" value={order_no} />
</form>

<Button
	on:click={() => {
		const form = document.getElementById(`receiptForm#${order_no}`);
		form?.submit();
	}}
>
	<Eye />
</Button>
