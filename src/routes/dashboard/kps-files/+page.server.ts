import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

const getKpsFolders = async () => {
	const { data } = await supabase.storage.from("kps-files").list("");
	if (data) return data;
};

const getKpsFiles = async (kpsFolders: any) => {
	const promises = kpsFolders.map(
		async (folder: { name: string | undefined }) => {
			const { data } = await supabase.storage
				.from("kps-files")
				.list(folder.name, {
					sortBy: { column: "created_at", order: "desc" },
				});

			return data?.map((file) => ({ folder: folder.name, file }));
		}
	);

	const kpsFiles = await Promise.all(promises);
	return kpsFiles.flat();
};

export const load: PageServerLoad = async () => {
	const kpsFolders = await getKpsFolders();

	return {
		kpsFolders,
		kpsFiles: await getKpsFiles(kpsFolders),
	};
};
