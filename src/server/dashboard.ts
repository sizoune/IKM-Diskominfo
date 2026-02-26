import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";
import { db } from "@/db/index";
import { layanan } from "@/db/schema/layanan";
import { surveys } from "@/db/schema/surveys";
import { tamu } from "@/db/schema/tamu";

export const getDashboardStats = createServerFn({ method: "GET" }).handler(
	async () => {
		const [surveyCount] = await db.select({ count: count() }).from(surveys);
		const [tamuCount] = await db.select({ count: count() }).from(tamu);
		const [layananCount] = await db.select({ count: count() }).from(layanan);

		return {
			totalSurvey: surveyCount?.count ?? 0,
			totalTamu: tamuCount?.count ?? 0,
			totalLayanan: layananCount?.count ?? 0,
		};
	},
);
