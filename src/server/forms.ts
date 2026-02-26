import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { forms } from "@/db/schema/forms";

export const getForms = createServerFn({ method: "GET" }).handler(async () => {
	return db.select().from(forms).orderBy(forms.order);
});

export const getFormById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const [form] = await db.select().from(forms).where(eq(forms.formId, id));
		return form ?? null;
	});

export const createForm = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { name: string; desc?: string; order?: number; active?: number }) =>
			data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(forms).values({
			name: data.name,
			desc: data.desc ?? null,
			order: data.order ?? 0,
			active: data.active ?? 1,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateForm = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			formId: number;
			name: string;
			desc?: string;
			order?: number;
			active?: number;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(forms)
			.set({
				name: data.name,
				desc: data.desc ?? null,
				order: data.order ?? 0,
				active: data.active ?? 1,
				updatedAt: now,
			})
			.where(eq(forms.formId, data.formId));
	});

export const deleteForm = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(forms).where(eq(forms.formId, id));
	});
