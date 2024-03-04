import { z } from "zod";

export const thesisOrderFormSchema = z.object({
	name: z.string(),
	phoneNum: z.string().min(10),
	thesisType: z.string({ required_error: "Please select a thesis type" }),
	coverColor: z.string({ required_error: "Please select a cover color" }),
	thesisTitle: z.string(),
	faculty: z.string(),
	year: z.string().length(4),
	studyAcronym: z.string(),
	matrixNum: z.string().min(8),
	colorPages: z.coerce.number().int().nonnegative(),
	blackWhitePages: z.coerce.number().int().nonnegative(),
	copies: z.coerce.number().int().positive().default(1),
	thesisFile: z
		.instanceof(File, { message: "Please upload a file." })
		.refine((f) => f.size < 52428800, "Max 50 MB upload size.")
		.nullable(),
	cdBurn: z.boolean().default(false),
	cdLabel: z
		.string({ required_error: "Please select a CD label" })
		.nullable(),
	cdCopies: z.coerce.number().int().nonnegative().nullable(),
	collectionDate: z
		.string()
		.refine((v) => v, { message: "Please select a collection date." }),
	collectionMethod: z.string({
		required_error: "Please select a collection method",
	}),
	address: z.string().nullable(),
});

export type FormSchema = typeof thesisOrderFormSchema;
