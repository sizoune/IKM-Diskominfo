import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { JK, PEKERJAAN, PENDIDIKAN } from "@/lib/constants";
import { tanggalIndonesia } from "@/lib/locale-id";
import { getBukuTamuReport } from "@/server/reports";

export const Route = createFileRoute("/admin/reports/buku-tamu")({
	component: BukuTamuReportPage,
});

function getDefaultDateRange() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
	return {
		startDate: `${year}-${month}-01`,
		endDate: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
	};
}

function BukuTamuReportPage() {
	const defaults = getDefaultDateRange();
	const [startDate, setStartDate] = useState(defaults.startDate);
	const [endDate, setEndDate] = useState(defaults.endDate);
	const [queryParams, setQueryParams] = useState<{
		startDate: string;
		endDate: string;
	} | null>(null);

	const startId = useId();
	const endId = useId();

	const { data: rows = [], isFetching } = useQuery({
		queryKey: ["report-buku-tamu", queryParams],
		queryFn: () =>
			getBukuTamuReport({
				data: queryParams as { startDate: string; endDate: string },
			}),
		enabled: queryParams !== null,
	});

	function handleGenerate() {
		setQueryParams({ startDate, endDate });
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Laporan Buku Tamu</h1>

			<Card>
				<CardHeader>
					<CardTitle>Filter</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-end gap-4">
						<div className="space-y-2">
							<Label htmlFor={startId}>Tanggal Mulai</Label>
							<Input
								id={startId}
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={endId}>Tanggal Akhir</Label>
							<Input
								id={endId}
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<Button onClick={handleGenerate} disabled={isFetching}>
							{isFetching ? "Memuat..." : "Generate"}
						</Button>
						{rows.length > 0 && (
							<Button variant="outline" onClick={() => window.print()}>
								<Printer className="mr-2 size-4" />
								Print
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{queryParams !== null && (
				<Card>
					<CardHeader>
						<CardTitle>
							Data Buku Tamu ({tanggalIndonesia(queryParams.startDate)} &mdash;{" "}
							{tanggalIndonesia(queryParams.endDate)})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{rows.length === 0 && !isFetching ? (
							<p className="text-sm text-muted-foreground">
								Tidak ada data pada rentang tanggal ini.
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>No.</TableHead>
										<TableHead>Tanggal</TableHead>
										<TableHead>Nama</TableHead>
										<TableHead>NIP</TableHead>
										<TableHead>Jenis Kelamin</TableHead>
										<TableHead>Umur</TableHead>
										<TableHead>Pendidikan</TableHead>
										<TableHead>Pekerjaan</TableHead>
										<TableHead>Layanan</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((row, index) => (
										<TableRow key={row.tamuId}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>
												{row.surveyDate
													? tanggalIndonesia(row.surveyDate)
													: "-"}
											</TableCell>
											<TableCell>{row.nama ?? "-"}</TableCell>
											<TableCell>{row.nip ?? "-"}</TableCell>
											<TableCell>
												{row.jk
													? (JK[row.jk as keyof typeof JK] ?? row.jk)
													: "-"}
											</TableCell>
											<TableCell>{row.umur ?? "-"}</TableCell>
											<TableCell>
												{row.pendidikan
													? (PENDIDIKAN[
															row.pendidikan as keyof typeof PENDIDIKAN
														] ?? row.pendidikan)
													: "-"}
											</TableCell>
											<TableCell>
												{row.pekerjaan
													? (PEKERJAAN[
															row.pekerjaan as keyof typeof PEKERJAAN
														] ?? row.pekerjaan)
													: "-"}
											</TableCell>
											<TableCell>{row.layananNama ?? "-"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
