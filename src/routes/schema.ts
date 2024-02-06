import { z } from "zod";

export const checkOrderStatusFormSchema = z.object({
	orderNo: z.string().length(7),
});

export type FormSchema = typeof checkOrderStatusFormSchema;
