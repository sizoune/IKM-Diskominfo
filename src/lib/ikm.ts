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
