import { supabase } from "$lib/supabaseClient";
import { fail, setError, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { fileUploadFormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(fileUploadFormSchema)),
		title: "File Uploader - ",
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(fileUploadFormSchema));
		if (!form.valid) return fail(400, { form });

		const { data } = await supabase
			.from("file_uploads")
			.select("notes")
			.eq("name", form.data.name);

		let notes =
			data?.length === 0
				? form.data.notes
				: `${data![0].notes}, ${form.data.notes}`;

		const { error } = await supabase
			.from("file_uploads")
			.upsert({ name: form.data.name, notes }, { onConflict: "name" });

		if (error) return fail(400, withFiles({ form }));

		for (const file of form.data.files) {
			const { error } = await supabase.storage
				.from("kps-files")
				.upload(`${form.data.name}/${file.name}`, file);

			if (error) return setError(form, "files._errors", error.message);
		}

		return withFiles({ form });
	},
} satisfies Actions;
