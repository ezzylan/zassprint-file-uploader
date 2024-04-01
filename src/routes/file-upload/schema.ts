import { z } from "zod";

export const fileUploadFormSchema = z.object({
	name: z.string().min(2).max(20),
	files: z
		.instanceof(File, { message: "Please upload a file." })
		.refine((f) => f.size < 50000000, "Max 50 MB upload size.")
		.array(),
	notes: z.object({ file: z.string(), note: z.string() }).array().nullable(),
});

export type FormSchema = typeof fileUploadFormSchema;
