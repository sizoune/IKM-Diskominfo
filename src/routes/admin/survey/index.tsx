import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { getSurveys } from "@/server/surveys";

export const Route = createFileRoute("/admin/survey/")({
	component: SurveyListPage,
});

type SurveyRow = {
	surveyId: number;
	date: string | null;
	total: number | null;
	saran: string | null;
	tamuNama: string | null;
	layananNama: string | null;
	formName: string | null;
	createdAt: string | null;
};

function SurveyListPage() {
	const { data: surveys = [] } = useQuery({
		queryKey: ["surveys"],
		queryFn: () => getSurveys(),
	});

	const columns: ColumnDef<SurveyRow>[] = [
		{ accessorKey: "surveyId", header: "ID", size: 50 },
		{ accessorKey: "date", header: "Tanggal", size: 100 },
		{ accessorKey: "tamuNama", header: "Tamu", size: 150 },
		{ accessorKey: "formName", header: "Form", size: 120 },
		{ accessorKey: "layananNama", header: "Layanan", size: 120 },
		{
			accessorKey: "total",
			header: "Total",
			cell: ({ row }) =>
				row.original.total != null ? row.original.total.toFixed(2) : "-",
		},
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<Button variant="ghost" size="icon" asChild>
					<Link
						to="/admin/survey/$surveyId"
						params={{
							surveyId: String(row.original.surveyId),
						}}
					>
						<Eye className="size-4" />
					</Link>
				</Button>
			),
		},
	];

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Survey</h1>
			<DataTable
				columns={columns}
				data={surveys as SurveyRow[]}
				searchKey="tamuNama"
				searchPlaceholder="Cari berdasarkan nama tamu..."
			/>
		</div>
	);
}
