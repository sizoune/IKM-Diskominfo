const BULAN = [
	"Januari",
	"Februari",
	"Maret",
	"April",
	"Mei",
	"Juni",
	"Juli",
	"Agustus",
	"September",
	"Oktober",
	"November",
	"Desember",
];

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function bulanIndonesia(month: number): string {
	return BULAN[month] ?? "";
}

export function tanggalIndonesia(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function hariIndonesia(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return HARI[d.getDay()] ?? "";
}
