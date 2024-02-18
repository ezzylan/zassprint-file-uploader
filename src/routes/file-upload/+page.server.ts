import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { fileUploadFormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(fileUploadFormSchema),
		title: "File Uploader - ",
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, fileUploadFormSchema);

		if (!form.valid) return fail(400, { form });

		const name = formData.get("name");
		const files = formData.getAll("files");

		for (const file of files) {
			const { error } = await supabase.storage
				.from("kps-files")
				.upload(`${name}/${file.name}`, file);

			if (error) return setError(form, "files", error.message);
		}

		return { form };
	},
};
