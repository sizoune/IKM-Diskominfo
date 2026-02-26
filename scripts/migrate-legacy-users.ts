import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import mysql from "mysql2/promise";
import { hashPassword } from "better-auth/crypto";

config({ path: [".env"] });

const DEFAULT_PASSWORD = "masukhaja";

async function main() {
	const conn = await mysql.createConnection(process.env.DATABASE_URL!);

	console.log("Fetching legacy users...");
	const [legacyUsers] = await conn.query<mysql.RowDataPacket[]>(
		"SELECT user_id, name, username, email, role, active, created_at, updated_at FROM users",
	);

	console.log(`Found ${legacyUsers.length} legacy user(s)`);
	console.log(`All passwords will be reset to: "${DEFAULT_PASSWORD}"\n`);

	const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
	let migrated = 0;
	let skipped = 0;

	for (const legacy of legacyUsers) {
		// Skip inactive users
		if (!legacy.active) {
			console.log(`  SKIP (inactive): ${legacy.username}`);
			skipped++;
			continue;
		}

		// Check if already migrated (by username or email)
		const [existing] = await conn.query<mysql.RowDataPacket[]>(
			"SELECT id FROM `user` WHERE username = ? OR (email = ? AND email IS NOT NULL)",
			[legacy.username, legacy.email],
		);

		if (existing.length > 0) {
			console.log(`  SKIP (exists): ${legacy.username}`);
			skipped++;
			continue;
		}

		const userId = randomUUID();
		const now = new Date();
		const email = legacy.email || `${legacy.username}@legacy.local`;

		// Insert into Better Auth user table
		await conn.query(
			`INSERT INTO \`user\` (id, name, email, email_verified, username, display_username, role, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				userId,
				legacy.name,
				email,
				legacy.email ? true : false,
				legacy.username.toLowerCase(),
				legacy.username,
				legacy.role,
				legacy.created_at || now,
				legacy.updated_at || now,
			],
		);

		// Insert into Better Auth account table with reset password
		const accountId = randomUUID();
		await conn.query(
			`INSERT INTO \`account\` (id, account_id, provider_id, user_id, password, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				accountId,
				userId,
				"credential",
				userId,
				hashedPassword,
				legacy.created_at || now,
				legacy.updated_at || now,
			],
		);

		console.log(`  OK: ${legacy.username} (${email})`);
		migrated++;
	}

	console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`);
	await conn.end();
}

main().catch((e) => {
	console.error("Migration failed:", e.message);
	process.exit(1);
});
