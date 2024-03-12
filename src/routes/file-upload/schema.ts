import { z } from "zod";

export const fileUploadFormSchema = z.object({
	name: z.string().min(2).max(20),
	files: z
		.instanceof(File, { message: "Please upload a file." })
		.refine((f) => f.size < 52428800, "Max 50 MB upload size.")
		.array(),
	notes: z.string().nullable(),
});

export type FormSchema = typeof fileUploadFormSchema;
