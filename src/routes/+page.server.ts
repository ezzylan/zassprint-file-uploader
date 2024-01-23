import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(formSchema),
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);
		const formData = await request.formData();
		const form = await superValidate(formData, formSchema);

		if (!form.valid) return fail(400, { form });

		const name = formData.get("name");
		const files = formData.getAll("files");

		for (const file of files) {
			const { data, error } = await supabase.storage
				.from("files")
				.upload(`${name}/${file.name}`, file);

			if (error) return setError(form, "files", error.message);
		}

		return { form };
	},
};
