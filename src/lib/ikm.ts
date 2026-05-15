/** Get mutu grade based on average score */
export function getMutu(avg: number): {
	grade: string;
	label: string;
	color: string;
} {
	if (avg >= 3.5324)
		return { grade: "A", label: "Sangat Baik", color: "green" };
	if (avg >= 2.5976) return { grade: "B", label: "Baik", color: "blue" };
	if (avg >= 1.7644)
		return { grade: "C", label: "Kurang Baik", color: "yellow" };
	return { grade: "D", label: "Tidak Baik", color: "red" };
}

/** Count IKM total score */
export function countTotal(
	totalNilai: number,
	count: number,
	nilaiIndex = 4,
): number {
	if (count === 0) return 0;
	return (totalNilai / count) * (25 / nilaiIndex);
}

/** Map mutu color string to Tailwind badge classes (Kominfo palette). */
export function getMutuBadgeClasses(color: string): string {
	switch (color) {
		case "green":
			return "bg-green-100 text-green-800 border-green-300";
		case "blue":
			return "bg-blue-100 text-blue-800 border-blue-300";
		case "yellow":
			return "bg-amber-100 text-amber-800 border-amber-300";
		default:
			return "bg-red-100 text-red-800 border-red-300";
	}
}

/** Map mutu color string to bar/chart fill color (Kominfo palette hex). */
export function getMutuFillHex(color: string): string {
	switch (color) {
		case "green":
			return "#16a34a";
		case "blue":
			return "#2563eb";
		case "yellow":
			return "#f59e0b";
		default:
			return "#991b1b";
	}
}
