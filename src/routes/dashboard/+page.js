/** @type {import('./$types').PageLoad} */
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from "$env/static/public";

export async function load() {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

	// const supabase = data.supabase
	const { data, error } = await supabase.storage
		.from("files")
		.list("", { offset: 1 });

	if (data) {
		return { supabase, data };
	} else {
		console.log(error);
	}
}
