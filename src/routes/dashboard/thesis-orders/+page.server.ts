import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

const getThesisOrders = async () => {
	const { data, error } = await supabase
		.from("thesis-orders")
		.select()
		.order("order_no", { ascending: false });

	if (data) return data;
};

export const load: PageServerLoad = async () => {
	return { thesisOrders: await getThesisOrders() };
};
