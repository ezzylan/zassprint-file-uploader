import { z } from "zod";

export const fileUploadFormSchema = z.object({
	name: z.string().min(2).max(20),
	files: z
		.custom<File>((f) => f instanceof File, "Please upload a file.")
		.refine((f) => f.size < 52428800, "Max 50 MB upload size.")
		.array(),
});

export type FormSchema = typeof fileUploadFormSchema;
