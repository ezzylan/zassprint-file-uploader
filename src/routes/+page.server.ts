import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { orderStatusFormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(orderStatusFormSchema)),
		title: "",
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(orderStatusFormSchema));
		if (!form.valid) return fail(400, { form });

		const { data } = await supabase
			.from("thesis_orders")
			.select("status")
			.eq("order_no", form.data.orderNo);

		let status: string;

		if (data && data.length > 0) {
			status = data[0].status;
		} else {
			return setError(
				form,
				"orderNo",
				"Sorry, your order does not exist."
			);
		}

		return { form, status };
	},
};
