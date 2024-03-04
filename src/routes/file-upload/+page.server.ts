import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import {
	setError,
	superValidate,
	withFiles,
} from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { fileUploadFormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(fileUploadFormSchema)),
		title: "File Uploader - ",
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(fileUploadFormSchema));
		if (!form.valid) return fail(400, withFiles({ form }));

		for (const file of form.data.files) {
			const { error } = await supabase.storage
				.from("kps-files")
				.upload(`${form.data.name}/${file.name}`, file);

			if (error) return setError(form, "files._errors", error.message);
		}

		return withFiles({ form });
	},
};
