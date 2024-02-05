import { z } from "zod";

export const fileUploadFormSchema = z.object({
	name: z.string().min(2).max(20),
	files: z.any(),
});

export type FormSchema = typeof fileUploadFormSchema;
