/**
 * One-time script to migrate legacy Laravel users to Better Auth.
 *
 * Usage: npx tsx src/scripts/migrate-users.ts
 *
 * - Reads all rows from the legacy `users` table
 * - Creates records in Better Auth `user` + `account` tables
 * - Resets all passwords to "masukhaja"
 */

import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

import crypto from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { account, user } from "../db/schema/auth";
import { legacyUsers } from "../db/schema/legacy-users";

const db = drizzle(process.env.DATABASE_URL!);

const DEFAULT_PASSWORD = "masukhaja";

async function main() {
	console.log("Starting user migration...");

	const legacyRows = await db.select().from(legacyUsers);
	console.log(`Found ${legacyRows.length} legacy users`);

	const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
	console.log("Password hash generated for default password");

	let migrated = 0;
	let skipped = 0;

	for (const legacy of legacyRows) {
		const userId = crypto.randomUUID();
		const email = legacy.email || `${legacy.username}@ikm-diskominfo.local`;

		// Check if user already exists (by username)
		const existing = await db
			.select()
			.from(user)
			.where(eq(user.username, legacy.username));

		if (existing.length > 0) {
			console.log(`  Skip: ${legacy.username} (already exists)`);
			skipped++;
			continue;
		}

		// Create Better Auth user record
		await db.insert(user).values({
			id: userId,
			name: legacy.name,
			email,
			emailVerified: true,
			username: legacy.username,
			displayUsername: legacy.username,
			role: legacy.role === "super-admin" ? "admin" : legacy.role,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Create account with credential provider
		await db.insert(account).values({
			id: crypto.randomUUID(),
			accountId: userId,
			providerId: "credential",
			userId,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		console.log(
			`  OK: ${legacy.username} (${legacy.name}) role=${legacy.role}`,
		);
		migrated++;
	}

	console.log(
		`\nDone! Migrated: ${migrated}, Skipped: ${skipped}, Total: ${legacyRows.length}`,
	);
	process.exit(0);
}

main().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
