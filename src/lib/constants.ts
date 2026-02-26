export const JK = {
	L: "Laki-Laki",
	P: "Perempuan",
} as const;

export const PENDIDIKAN = {
	SD: "SD",
	SMP: "SMP",
	SMA: "SMA/SMK",
	D1: "D1",
	D2: "D2",
	D3: "D3",
	D4: "D4/S1",
	S2: "S2",
	S3: "S3",
} as const;

export const PEKERJAAN = {
	PNS: "PNS/ASN",
	TNI: "TNI/Polri",
	SWASTA: "Karyawan Swasta",
	WIRASWASTA: "Wiraswasta",
	PELAJAR: "Pelajar/Mahasiswa",
	LAINNYA: "Lainnya",
} as const;

export const STATUS = {
	ASN: "ASN",
	NON_ASN: "Non-ASN",
} as const;

export const LAYANAN_TIPE = {
	ONLINE: "online",
	OFFLINE: "offline",
} as const;

/** Poin IKM berdasarkan jawaban 1-4 */
export const ANSWER_POIN: Record<number, string> = {
	1: "Tidak Baik",
	2: "Kurang Baik",
	3: "Baik",
	4: "Sangat Baik",
};
