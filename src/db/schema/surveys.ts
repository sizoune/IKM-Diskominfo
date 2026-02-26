import { relations } from "drizzle-orm";
import {
	bigint,
	date,
	double,
	int,
	longtext,
	mysqlTable,
	text,
	timestamp,
} from "drizzle-orm/mysql-core";
import { formQuestions, forms } from "./forms";
import { layanan } from "./layanan";
import { tamu } from "./tamu";

export const surveys = mysqlTable("surveys", {
	surveyId: bigint("survey_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	tamuId: int("tamu_id"),
	layananId: int("layanan_id"),
	formId: int("form_id"),
	date: date({ mode: "string" }),
	total: double(),
	saran: text(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const answers = mysqlTable("answers", {
	answerId: bigint("answer_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	formQuestionId: int("form_question_id"),
	surveyId: int("survey_id"),
	answerJson: longtext("answer_json"),
	value: int().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

// Relations
export const surveysRelations = relations(surveys, ({ one, many }) => ({
	tamu: one(tamu, {
		fields: [surveys.tamuId],
		references: [tamu.tamuId],
	}),
	layanan: one(layanan, {
		fields: [surveys.layananId],
		references: [layanan.layananId],
	}),
	form: one(forms, {
		fields: [surveys.formId],
		references: [forms.formId],
	}),
	answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
	survey: one(surveys, {
		fields: [answers.surveyId],
		references: [surveys.surveyId],
	}),
	question: one(formQuestions, {
		fields: [answers.formQuestionId],
		references: [formQuestions.formQuestionId],
	}),
}));

export const tamuRelations = relations(tamu, ({ many }) => ({
	surveys: many(surveys),
}));

export const layananRelations = relations(layanan, ({ many }) => ({
	surveys: many(surveys),
}));
