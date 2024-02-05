import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { data, error } = await supabase
		.from("thesis-orders")
		.select()
		.eq("order_no", params.slug);

	if (data) {
		return { order: data };
	}
};
