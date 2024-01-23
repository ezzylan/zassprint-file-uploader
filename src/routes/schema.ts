import { z } from "zod";

export const formSchema = z.object({
	name: z.string().min(2).max(10),
	files: z.any(),
});

export type FormSchema = typeof formSchema;
