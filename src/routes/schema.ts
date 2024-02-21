import { z } from "zod";

export const orderStatusFormSchema = z.object({
	orderNo: z.string().length(7),
});

export type FormSchema = typeof orderStatusFormSchema;
