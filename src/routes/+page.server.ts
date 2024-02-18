import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { checkOrderStatusFormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(checkOrderStatusFormSchema),
		title: "",
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, checkOrderStatusFormSchema);

		if (!form.valid) return fail(400, { form });

		const orderNo = formData.get("orderNo");
		let thesisOrder, status: string;

		const { data } = await supabase
			.from("thesis-orders")
			.select()
			.eq("order_no", orderNo);

		if (data && data.length > 0) {
			thesisOrder = data[0];
			status = thesisOrder.status;
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
