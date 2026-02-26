import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANSWER_POIN } from "@/lib/constants";
import { getSurveyById } from "@/server/surveys";

export const Route = createFileRoute("/admin/survey/$surveyId")({
	component: SurveyDetailPage,
});

function SurveyDetailPage() {
	const { surveyId } = useParams({ from: "/admin/survey/$surveyId" });
	const { data: survey } = useQuery({
		queryKey: ["survey", surveyId],
		queryFn: () => getSurveyById({ data: Number(surveyId) }),
	});

	if (!survey) {
		return <div>Memuat...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Link to="/admin/survey" className="hover:text-foreground">
					Survey
				</Link>
				<ChevronRight className="size-4" />
				<span className="text-foreground">Detail #{surveyId}</span>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Info Survey</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Tanggal</span>
							<span>{survey.date}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Form</span>
							<span>{survey.formName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Layanan</span>
							<span>{survey.layananNama}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Total</span>
							<Badge>{survey.total?.toFixed(2) ?? "-"}</Badge>
						</div>
						{survey.saran && (
							<div>
								<span className="text-muted-foreground">Saran:</span>
								<p className="mt-1">{survey.saran}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Info Tamu</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Nama</span>
							<span>{survey.tamuNama}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">NIP</span>
							<span>{survey.tamuNip ?? "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">JK</span>
							<span>{survey.tamuJk}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Umur</span>
							<span>{survey.tamuUmur}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Pendidikan</span>
							<span>{survey.tamuPendidikan}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Pekerjaan</span>
							<span>{survey.tamuPekerjaan}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>{survey.tamuStatus}</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Jawaban</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{survey.answers.map((a) => (
							<div
								key={a.answerId}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div className="space-y-1">
									<span className="text-xs text-muted-foreground">
										{a.questionKode}
									</span>
									<p className="text-sm">{a.questionText}</p>
								</div>
								<Badge variant="outline">
									{a.value} - {ANSWER_POIN[a.value] ?? "N/A"}
								</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
