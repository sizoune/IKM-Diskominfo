import { drizzle } from "drizzle-orm/mysql2";

import * as schema from "./schema.ts";

// biome-ignore lint/style/noNonNullAssertion: env var validated at startup
export const db = drizzle(process.env.DATABASE_URL!, {
	schema,
	mode: "default",
});
