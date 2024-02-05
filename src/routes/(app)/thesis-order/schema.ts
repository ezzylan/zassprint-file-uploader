import { z } from "zod";

export const thesisOrderFormSchema = z.object({
	name: z.string(),
	phoneNum: z.string().min(10),
	thesisType: z.enum([
		"Hard Cover",
		"Soft Cover",
		"Comb Binding",
		"Tape Binding",
	]),
	coverColor: z.enum([
		"Research Report (Navy Blue)",
		"Dissertation/Thesis (Dark Red/Maroon)",
		"Ocean Blue",
		"Plastic Cover",
	]),
	thesisTitle: z.string(),
	faculty: z.string(),
	year: z.string().length(4),
	studyAcronym: z.string(),
	matrixNum: z.string().min(8),
	colorPages: z.coerce.number().int().nonnegative(),
	blackWhitePages: z.coerce.number().int().nonnegative(),
	copies: z.coerce.number().int().positive().default(1),
	thesisFile: z.any(),
	cdBurn: z.boolean(),
	cdLabel: z.enum(["Sticker Label", "Paper Label"]).nullable(),
	cdCopies: z.coerce.number().int().nonnegative().nullable(),
	collectionDate: z.string().length(10),
	collectionMethod: z.enum(["Delivery", "Pick Up"]),
	address: z.string().nullish(),
});

export type FormSchema = typeof thesisOrderFormSchema;
