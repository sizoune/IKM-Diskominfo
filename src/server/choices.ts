import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { choices } from "@/db/schema/forms";

export const getChoicesByQuestionId = createServerFn({ method: "GET" })
	.inputValidator((questionId: number) => questionId)
	.handler(async ({ data: questionId }) => {
		return db
			.select()
			.from(choices)
			.where(eq(choices.formQuestionId, questionId));
	});

export const createChoice = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			formQuestionId: number;
			label: string;
			value?: string;
			kode?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db.insert(choices).values({
			formQuestionId: data.formQuestionId,
			label: data.label,
			value: data.value ?? null,
			kode: data.kode ?? null,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateChoice = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			choiceId: number;
			label: string;
			value?: string;
			kode?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(choices)
			.set({
				label: data.label,
				value: data.value ?? null,
				kode: data.kode ?? null,
				updatedAt: now,
			})
			.where(eq(choices.choiceId, data.choiceId));
	});

export const deleteChoice = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(choices).where(eq(choices.choiceId, id));
	});
