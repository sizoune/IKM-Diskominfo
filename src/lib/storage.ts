import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY || "",
		secretAccessKey: process.env.S3_SECRET_KEY || "",
	},
	forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "ikm-diskominfo";

/**
 * Upload a file to S3/MinIO.
 * Returns the object key (path) that can be stored in the database.
 */
export async function uploadFile(
	key: string,
	body: Buffer | Uint8Array,
	contentType: string,
): Promise<string> {
	await s3.send(
		new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			Body: body,
			ContentType: contentType,
		}),
	);
	return key;
}

/**
 * Get a presigned URL for viewing/downloading a file.
 * Default expiry: 1 hour.
 */
export async function getFileUrl(
	key: string,
	expiresIn = 3600,
): Promise<string> {
	return getSignedUrl(
		s3,
		new GetObjectCommand({ Bucket: BUCKET, Key: key }),
		{ expiresIn },
	);
}

/**
 * Delete a file from S3/MinIO.
 */
export async function deleteFile(key: string): Promise<void> {
	await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
