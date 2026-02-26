import { createServerFn } from "@tanstack/react-start";

export const lookupAsn = createServerFn({ method: "GET" })
	.inputValidator((nip: string) => nip)
	.handler(async ({ data: nip }) => {
		// TODO: Configure actual e-office API endpoint in .env.local
		// E.g. EOFFICE_API_URL=https://eoffice.example.go.id/api/pegawai
		const apiUrl = process.env.EOFFICE_API_URL;
		if (!apiUrl) {
			return null;
		}

		try {
			const res = await fetch(`${apiUrl}?nip=${encodeURIComponent(nip)}`);
			if (!res.ok) return null;
			const data = await res.json();
			return data as { nama?: string; nip?: string; jabatan?: string } | null;
		} catch {
			return null;
		}
	});
