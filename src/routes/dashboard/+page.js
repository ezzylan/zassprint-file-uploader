/** @type {import('./$types').PageLoad} */
import { createClient } from "@supabase/supabase-js";

export async function load() {
	const supabase = createClient(
		"https://pjritsgfzszporzzznep.supabase.co",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcml0c2dmenN6cG9yenp6bmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzODczMjAsImV4cCI6MjAxOTk2MzMyMH0.DUpSDdDN9Rlbx_4eF5PHp4DBebjSKnp1bZh4PNzzEgU"
	);

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
