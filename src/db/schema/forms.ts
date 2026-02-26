import { relations } from "drizzle-orm";
import {
	bigint,
	int,
	longtext,
	mysqlTable,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const forms = mysqlTable("forms", {
	formId: bigint("form_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	name: varchar({ length: 190 }),
	desc: varchar({ length: 190 }),
	order: int(),
	active: tinyint(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const formQuestions = mysqlTable("form_questions", {
	formQuestionId: bigint("form_question_id", {
		mode: "number",
		unsigned: true,
	})
		.autoincrement()
		.primaryKey(),
	formId: int("form_id"),
	questionType: varchar("question_type", { length: 190 }).notNull(),
	kode: varchar({ length: 190 }),
	active: varchar({ length: 190 }),
	order: int(),
	text: longtext(),
	prepend: text(),
	append: text(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const choices = mysqlTable("choices", {
	choiceId: bigint("choice_id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	formQuestionId: int("form_question_id"),
	label: varchar({ length: 190 }),
	value: text(),
	kode: text(),
	createdAt: timestamp("created_at", { mode: "string" }),
	updatedAt: timestamp("updated_at", { mode: "string" }),
});

// Relations
export const formsRelations = relations(forms, ({ many }) => ({
	questions: many(formQuestions),
}));

export const formQuestionsRelations = relations(
	formQuestions,
	({ one, many }) => ({
		form: one(forms, {
			fields: [formQuestions.formId],
			references: [forms.formId],
		}),
		choices: many(choices),
	}),
);

export const choicesRelations = relations(choices, ({ one }) => ({
	question: one(formQuestions, {
		fields: [choices.formQuestionId],
		references: [formQuestions.formQuestionId],
	}),
}));
