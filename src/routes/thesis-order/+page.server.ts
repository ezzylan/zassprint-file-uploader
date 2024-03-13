import { TELEGRAM_BOT_API_TOKEN } from "$env/static/private";
import { supabase } from "$lib/supabaseClient";
import { fail } from "@sveltejs/kit";
import dayjs from "dayjs";
import type { Infer, SuperValidated } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { thesisOrderFormSchema, type FormSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(thesisOrderFormSchema)),
		title: "Thesis Order Form - ",
	};
};

// const uploadFile = async (file: File) => {
// 	const { data, error } = await supabase.storage
// 		.from("thesis-files")
// 		.upload(file.name, file);

// 	return error ?? getPublicUrl(data.path);
// };

// const getPublicUrl = (fileName: string) => {
// 	const { data } = supabase.storage
// 		.from("thesis-files")
// 		.getPublicUrl(fileName, { download: true });

// 	return data.publicUrl;
// };

const countExistingOrders = async () => {
	const { data } = await supabase
		.from("thesis_orders")
		.select("order_no")
		.order("order_no", { ascending: true })
		.gte("created_at", `${dayjs().format("YYYY-MM")}-01`)
		.lt("created_at", `${dayjs().add(1, "month").format("YYYY-MM")}-01`);

	return data?.length === 0
		? `${dayjs().format("YYMM")}001`
		: (Number(data?.pop()?.order_no) + 1).toString();
};

const toTitleCase = (str: string) => {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
};

const insertDatabase = async (
	form: SuperValidated<Infer<FormSchema>>,
	orderNo: string
) => {
	await supabase.from("thesis_orders").insert({
		name: toTitleCase(form.data.name),
		phone_num: form.data.phoneNum,
		matrix_num: form.data.matrixNum,
		thesis_type: form.data.thesisType,
		cover_color: form.data.coverColor,
		thesis_title: form.data.thesisTitle,
		faculty: form.data.faculty,
		year: form.data.year,
		study_acronym: form.data.studyAcronym,
		color_pages: form.data.colorPages,
		black_white_pages: form.data.blackWhitePages,
		copies: form.data.copies,
		cd_label: form.data.cdBurn ? form.data.cdLabel : null,
		cd_copies: form.data.cdBurn ? form.data.cdCopies : null,
		collection_date: form.data.collectionDate,
		collection_method: form.data.collectionMethod,
		address:
			form.data.collectionMethod === "Delivery"
				? form.data.address
				: null,
		order_no: orderNo,
	});
};

const sendTeleBotAlert = async (orderNo: string, name: string) => {
	let bodyContent = new FormData();
	bodyContent.append("chat_id", "@zassprintkps");
	bodyContent.append(
		"text",
		`New thesis order received: #${orderNo}
		${toTitleCase(name)}`
	);

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
		const form = await superValidate(request, zod(thesisOrderFormSchema));
		if (!form.valid) return fail(400, { form });

		// const thesisFile = form.data.thesisFile;
		// let thesisFileUrl = null;

		// if (thesisFile) {
		// 	thesisFileUrl = await uploadFile(thesisFile);

		// 	if (typeof thesisFileUrl !== "string") {
		// 		return setError(form, "thesisFile", thesisFileUrl.message);
		// 	}
		// }

		const orderNo = await countExistingOrders();
		try {
			await insertDatabase(form, orderNo);
			await sendTeleBotAlert(orderNo, form.data.name);
		} catch (error) {
			return fail(400, { form });
		}

		return { form, orderNo };
	},
};
