import { createServerFn } from "@tanstack/react-start";
import { avg, count, eq, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { formQuestions } from "@/db/schema/forms";
import { answers, surveys } from "@/db/schema/surveys";

export const getIkmData = createServerFn({ method: "GET" })
	.inputValidator((year: number) => year)
	.handler(async ({ data: year }) => {
		// Get average score per question for the given year
		const results = await db
			.select({
				formQuestionId: answers.formQuestionId,
				kode: formQuestions.kode,
				text: formQuestions.text,
				avgValue: avg(answers.value).as("avgValue"),
				totalResponden: count(answers.answerId).as("totalResponden"),
			})
			.from(answers)
			.innerJoin(surveys, eq(answers.surveyId, surveys.surveyId))
			.innerJoin(
				formQuestions,
				eq(answers.formQuestionId, formQuestions.formQuestionId),
			)
			.where(sql`YEAR(${surveys.date}) = ${year}`)
			.groupBy(answers.formQuestionId, formQuestions.kode, formQuestions.text)
			.orderBy(formQuestions.kode);

		return results.map((r) => ({
			formQuestionId: r.formQuestionId,
			kode: r.kode,
			text: r.text,
			avgValue: Number(r.avgValue) || 0,
			totalResponden: r.totalResponden,
		}));
	});

export const getAvailableYears = createServerFn({ method: "GET" }).handler(
	async () => {
		const years = await db
			.selectDistinct({
				year: sql<number>`YEAR(${surveys.date})`,
			})
			.from(surveys)
			.where(sql`${surveys.date} IS NOT NULL`)
			.orderBy(sql`YEAR(${surveys.date}) DESC`);
		return years.map((y) => y.year);
	},
);
