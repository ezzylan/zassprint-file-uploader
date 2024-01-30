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
	]),
	thesisTitle: z.string(),
	faculty: z.string(),
	year: z.string().length(4),
	studyAcronym: z.string(),
	matrixNum: z.string().min(8),
	colorPages: z.coerce.number().int().positive(),
	blackWhitePages: z.coerce.number().int().positive(),
	copies: z.coerce.number().int().positive(),
	thesisFile: z.any(),
	collectionDate: z.string(),
	collectionMethod: z.enum(["Delivery", "Pick Up"]),
	address: z.string(),
});

export type FormSchema = typeof thesisOrderFormSchema;
