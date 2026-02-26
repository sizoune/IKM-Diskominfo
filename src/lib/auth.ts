import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db/index";
import * as schema from "@/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		tanstackStartCookies(),
		username({
			usernameValidator: (username) => /^[a-zA-Z0-9_.\-]+$/.test(username),
		}),
		admin(),
	],
});
