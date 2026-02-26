import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, max } from "drizzle-orm";
import { db } from "@/db/index";
import { formQuestions } from "@/db/schema/forms";

export const getQuestionsByFormId = createServerFn({ method: "GET" })
	.inputValidator((formId: number) => formId)
	.handler(async ({ data: formId }) => {
		return db
			.select()
			.from(formQuestions)
			.where(eq(formQuestions.formId, formId))
			.orderBy(formQuestions.order);
	});

export const getQuestionById = createServerFn({ method: "GET" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const [q] = await db
			.select()
			.from(formQuestions)
			.where(eq(formQuestions.formQuestionId, id));
		return q ?? null;
	});

export const createQuestion = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			formId: number;
			questionType: string;
			kode?: string;
			active?: string;
			order?: number;
			text: string;
			prepend?: string;
			append?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");

		// Auto-increment order
		let orderVal = data.order ?? 0;
		if (orderVal === 0) {
			const [result] = await db
				.select({ maxOrder: max(formQuestions.order) })
				.from(formQuestions)
				.where(eq(formQuestions.formId, data.formId));
			orderVal = (result?.maxOrder ?? 0) + 1;
		}

		// Auto-generate kode if not provided
		let kodeVal = data.kode ?? "";
		if (!kodeVal) {
			const [result] = await db
				.select({ total: count() })
				.from(formQuestions)
				.where(eq(formQuestions.formId, data.formId));
			const questionNumber = (result?.total ?? 0) + 1;
			kodeVal = `${data.formId}.${questionNumber}`;
		}

		await db.insert(formQuestions).values({
			formId: data.formId,
			questionType: data.questionType,
			kode: kodeVal,
			active: data.active ?? "1",
			order: orderVal,
			text: data.text,
			prepend: data.prepend ?? null,
			append: data.append ?? null,
			createdAt: now,
			updatedAt: now,
		});
	});

export const updateQuestion = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			formQuestionId: number;
			questionType: string;
			kode?: string;
			active?: string;
			order?: number;
			text: string;
			prepend?: string;
			append?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const now = new Date().toISOString().slice(0, 19).replace("T", " ");
		await db
			.update(formQuestions)
			.set({
				questionType: data.questionType,
				kode: data.kode ?? null,
				active: data.active ?? "1",
				order: data.order ?? 0,
				text: data.text,
				prepend: data.prepend ?? null,
				append: data.append ?? null,
				updatedAt: now,
			})
			.where(eq(formQuestions.formQuestionId, data.formQuestionId));
	});

export const deleteQuestion = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		await db.delete(formQuestions).where(eq(formQuestions.formQuestionId, id));
	});
