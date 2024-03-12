import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

const getKpsCustomers = async () => {
	const { data } = await supabase
		.from("file_uploads")
		.select()
		.order("created_at", { ascending: false });

	return data ?? [];
};

const getKpsFiles = async (kpsCustomers: any[]) => {
	const promises = kpsCustomers.map(
		async (customer: { name: string }) => {
			const { data } = await supabase.storage
				.from("kps-files")
				.list(customer.name, {
					sortBy: { column: "created_at", order: "desc" },
				});

			return data?.map((file) => ({ customer: customer.name, file }));
		}
	);

	const kpsFiles = await Promise.all(promises);
	return kpsFiles.flat();
};

export const load: PageServerLoad = async () => {
	const kpsCustomers = await getKpsCustomers();

	return {
		kpsCustomers,
		getKpsFiles: getKpsFiles(kpsCustomers),
	};
};
