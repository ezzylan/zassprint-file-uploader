import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

const getThesisOrders = async () => {
	const { data } = await supabase
		.from("thesis_orders")
		.select()
		.order("order_no", { ascending: false });

	return data ?? [];
};

export const load: PageServerLoad = async () => {
	return { thesisOrders: await getThesisOrders() };
};
