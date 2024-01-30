import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

const getKpsFolders = async () => {
	const { data, error } = await supabase.storage.from("kps-files").list("");
	return data ?? error;
};

const getKpsFiles = async (kpsFolders: any) => {
	const promises = kpsFolders.map(
		async (folder: { name: string | undefined }) => {
			const { data, error } = await supabase.storage
				.from("kps-files")
				.list(folder.name, {
					sortBy: { column: "created_at", order: "desc" },
				});

			if (data) {
				return data.map((file) => ({ folder: folder.name, file }));
			} else {
				console.error(error);
				return [];
			}
		}
	);

	const kpsFiles = await Promise.all(promises);
	return kpsFiles.flat();
};

const getThesisOrders = async () => {
	const { data, error } = await supabase.from("thesis-orders").select();
	return data ?? error;
};

export const load: PageServerLoad = async () => {
	const kpsFolders = await getKpsFolders();

	return {
		kpsFolders,
		kpsFiles: await getKpsFiles(kpsFolders),
		thesisOrders: await getThesisOrders(),
	};
};
