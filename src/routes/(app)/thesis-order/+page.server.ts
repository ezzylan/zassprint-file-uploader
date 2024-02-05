import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { SuperValidated } from "sveltekit-superforms";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { thesisOrderFormSchema, type FormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(thesisOrderFormSchema),
	};
};

const uploadFile = async (
	file: FormDataEntryValue,
	form: SuperValidated<FormSchema>
) => {
	const { data, error } = await supabase.storage
		.from("thesis-files")
		.upload(file.name, file);
	if (error) return setError(form, "thesisFile", error.message);
};

const getPublicUrl = async (file: FormDataEntryValue) => {
	const { data, error } = await supabase.storage
		.from("thesis-files")
		.getPublicUrl(file.name, { download: true });
	return data ? (data.publicUrl as string) : error;
};

const countExistingOrders = async () => {
	const { data, error } = await supabase
		.from("thesis-orders")
		.select("created_at")
		.gte("created_at", `${dayjs().format("YYYY-MM")}-01`)
		.lt("created_at", `${dayjs().add(1, "month").format("YYYY-MM")}-01`);

	if (data) {
		if (data.length === 0) {
			return "001";
		} else if (data.length < 9) {
			return `00${data.length + 1}`;
		} else if (data.length < 99) {
			return `0${data.length + 1}`;
		} else {
			return `${data.length + 1}`;
		}
	}
};

const insertDatabase = async (
	formDataObj: any,
	thesisFileUrl: string,
	orderNo: string
) => {
	const { error } = await supabase.from("thesis-orders").insert({
		name: formDataObj.name,
		phone_num: formDataObj.phoneNum,
		matrix_num: formDataObj.matrixNum,
		thesis_type: formDataObj.thesisType,
		cover_color: formDataObj.coverColor,
		thesis_title: formDataObj.thesisTitle,
		faculty: formDataObj.faculty,
		year: formDataObj.year,
		study_acronym: formDataObj.studyAcronym,
		color_pages: formDataObj.colorPages,
		black_white_pages: formDataObj.blackWhitePages,
		copies: formDataObj.copies,
		thesis_file_url: thesisFileUrl,
		cd_label: formDataObj.cdBurn === "true" ? formDataObj.cdLabel : null,
		cd_copies: formDataObj.cdBurn === "true" ? formDataObj.cdCopies : null,
		collection_date: formDataObj.collectionDate,
		collection_method: formDataObj.collectionMethod,
		address: formDataObj.address,
		order_no: `${dayjs().format("YYMM")}${orderNo}`,
	});
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, thesisOrderFormSchema);

		if (!form.valid) return fail(400, { form });

		const thesisFile = formData.get("thesisFile");
		const formDataObj = Object.fromEntries(formData.entries());
		const orderNo = (await countExistingOrders()) as string;

		if (thesisFile) {
			uploadFile(thesisFile, form)
				.then(() => getPublicUrl(thesisFile))
				.then((thesisFileUrl) =>
					insertDatabase(formDataObj, thesisFileUrl, orderNo)
				)
				.catch(() => fail(400, { form }));
		}

		return {
			form,
			orderNo: `${dayjs().format("YYMM")}${orderNo}`,
		};
	},
};
