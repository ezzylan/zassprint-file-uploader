import { TELEGRAM_BOT_API_TOKEN } from "$env/static/private";
import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { SuperValidated } from "sveltekit-superforms";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { thesisOrderFormSchema, type FormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(thesisOrderFormSchema),
		title: "Thesis Order Form - ",
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
	const { data, error } = supabase.storage
		.from("thesis-files")
		.getPublicUrl(file.name, { download: true });

	return data?.publicUrl;
};

const countExistingOrders = async () => {
	const { data, error } = await supabase
		.from("thesis-orders")
		.select("order_no")
		.order("order_no", { ascending: true })
		.gte("created_at", `${dayjs().format("YYYY-MM")}-01`)
		.lt("created_at", `${dayjs().add(1, "month").format("YYYY-MM")}-01`);

	if (data) {
		const orderNo =
			data.length === 0
				? `${dayjs().format("YYMM")}001`
				: (Number(data.pop()?.order_no) + 1).toString();

		return orderNo;
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
		order_no: orderNo,
	});
};

const sendTeleBotAlert = async (orderNo: string) => {
	let bodyContent = new FormData();
	bodyContent.append("chat_id", "@zassprintkps");
	bodyContent.append("text", `New thesis order received: #${orderNo}`);

	await fetch(
		`https://api.telegram.org/bot${TELEGRAM_BOT_API_TOKEN}/sendMessage`,
		{
			method: "POST",
			body: bodyContent,
		}
	);
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, thesisOrderFormSchema);

		if (!form.valid) return fail(400, { form });

		const thesisFile = formData.get("thesisFile");
		const formDataObj = Object.fromEntries(formData.entries());
		const orderNo = await countExistingOrders();

		if (thesisFile && orderNo) {
			uploadFile(thesisFile, form)
				.then(() => getPublicUrl(thesisFile))
				.then((thesisFileUrl: string) =>
					insertDatabase(formDataObj, thesisFileUrl, orderNo)
				)
				.then(() => sendTeleBotAlert(orderNo))
				.catch(() => fail(400, { form }));
		}

		return { form, orderNo };
	},
};
