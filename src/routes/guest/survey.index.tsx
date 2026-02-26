import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, CheckCircle2, ClipboardList, User } from "lucide-react";
import { useState } from "react";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	ANSWER_POIN,
	JK,
	PEKERJAAN,
	PENDIDIKAN,
	STATUS,
} from "@/lib/constants";
import { getForms } from "@/server/forms";
import { getActiveLayanan } from "@/server/layanan";
import { getQuestionsByFormId } from "@/server/questions";
import { submitSurvey } from "@/server/survey-submit";

export const Route = createFileRoute("/guest/survey/")({
	head: () => ({
		meta: [
			{ title: "Isi Survey Kepuasan — IKM Diskominfo" },
			{
				name: "description",
				content:
					"Sampaikan penilaian Anda terhadap kualitas pelayanan publik melalui survey Indeks Kepuasan Masyarakat (IKM) Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:title",
				content: "Isi Survey Kepuasan — IKM Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Sampaikan penilaian Anda terhadap kualitas pelayanan publik melalui survey Indeks Kepuasan Masyarakat (IKM) Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:url",
				content: "https://ikm.kominfo.go.id/guest/survey",
			},
		],
	}),
	component: SurveyPage,
});

const STEP_LABELS = ["Data Diri", "Survey", "Selesai"];

function StepIndicator({ current }: { current: number }) {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				{[1, 2, 3].map((s, idx) => {
					const isCompleted = s < current;
					const isActive = s === current;
					return (
						<div key={s} className="flex flex-1 items-center">
							<div className="flex flex-col items-center gap-1.5">
								<div
									className={`flex size-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${
										isCompleted
											? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200"
											: isActive
												? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-300"
												: "border-muted-foreground/30 bg-background text-muted-foreground"
									}`}
								>
									{isCompleted ? <Check className="size-4 stroke-[3]" /> : s}
								</div>
								<span
									className={`text-xs font-medium whitespace-nowrap ${
										isActive
											? "text-indigo-600"
											: isCompleted
												? "text-indigo-400"
												: "text-muted-foreground"
									}`}
								>
									{STEP_LABELS[idx]}
								</span>
							</div>
							{idx < 2 && (
								<div
									className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-500 ${
										s < current
											? "bg-gradient-to-r from-indigo-500 to-violet-500"
											: "bg-muted"
									}`}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function SurveyPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");

	// Respondent info
	const [status, setStatus] = useState("NON_ASN");
	const [nama, setNama] = useState("");
	const [nip, setNip] = useState("");
	const [jk, setJk] = useState("L");
	const [umur, setUmur] = useState(25);
	const [pendidikan, setPendidikan] = useState("SMA");
	const [pekerjaan, setPekerjaan] = useState("LAINNYA");
	const [layananId, setLayananId] = useState(0);
	const [saran, setSaran] = useState("");

	// Survey answers
	const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>(
		{},
	);

	const { data: formsList = [] } = useQuery({
		queryKey: ["forms-active"],
		queryFn: () => getForms(),
	});

	// Use the first active form
	const activeForm = formsList.find((f) => f.active === 1);
	const formId = activeForm?.formId ?? 0;

	const { data: questions = [] } = useQuery({
		queryKey: ["questions-survey", formId],
		queryFn: () => getQuestionsByFormId({ data: formId }),
		enabled: formId > 0,
	});

	const { data: layananList = [] } = useQuery({
		queryKey: ["layanan-active"],
		queryFn: () => getActiveLayanan(),
	});

	const submitMut = useMutation({
		mutationFn: submitSurvey,
		onSuccess: () => {
			setStep(3);
		},
		onError: (err) => {
			setError(err instanceof Error ? err.message : "Gagal menyimpan survey.");
		},
	});

	function handleNextStep() {
		if (!nama.trim()) {
			setError("Nama wajib diisi");
			return;
		}
		if (!layananId) {
			setError("Pilih layanan");
			return;
		}
		setError("");
		setStep(2);
	}

	function handleSubmit() {
		const activeQuestions = questions.filter((q) => q.active === "1");
		const allAnswered = activeQuestions.every(
			(q) => surveyAnswers[q.formQuestionId] != null,
		);
		if (!allAnswered) {
			setError("Jawab semua pertanyaan.");
			return;
		}
		setError("");
		submitMut.mutate({
			data: {
				formId,
				layananId,
				status,
				nama,
				nip: nip || undefined,
				jk,
				umur,
				pendidikan,
				pekerjaan,
				saran: saran || undefined,
				answers: Object.entries(surveyAnswers).map(([qId, val]) => ({
					formQuestionId: Number(qId),
					value: val,
				})),
			},
		});
	}

	const activeQuestions = questions.filter((q) => q.active === "1");
	const answeredCount = activeQuestions.filter(
		(q) => surveyAnswers[q.formQuestionId] != null,
	).length;
	const totalQuestions = activeQuestions.length;
	const progressPct =
		totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />
			<div className="flex-1 container mx-auto max-w-2xl px-4 py-8">
				<StepIndicator current={step} />

				{step === 1 && (
					<Card className="glass-card border-t-4 border-t-indigo-500 shadow-lg shadow-indigo-100/50">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-200">
									<User className="size-5 text-white" />
								</div>
								<div>
									<CardTitle className="text-xl">Informasi Responden</CardTitle>
									<p className="text-sm text-muted-foreground mt-0.5">
										Lengkapi data diri Anda untuk melanjutkan
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-5">
							{/* Personal Info Group */}
							<div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
								<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Informasi Pribadi
								</p>
								<div className="space-y-2">
									<Label>Status</Label>
									<Select value={status} onValueChange={setStatus}>
										<SelectTrigger className="w-full min-h-[44px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(STATUS).map(([k, v]) => (
												<SelectItem key={k} value={k}>
													{v}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{status === "ASN" && (
									<div className="space-y-2">
										<Label>NIP</Label>
										<Input
											value={nip}
											onChange={(e) => setNip(e.target.value)}
											placeholder="Masukkan NIP"
											className="min-h-[44px]"
										/>
									</div>
								)}
								<div className="space-y-2">
									<Label>
										Nama Lengkap <span className="text-destructive">*</span>
									</Label>
									<Input
										value={nama}
										onChange={(e) => setNama(e.target.value)}
										placeholder="Masukkan nama lengkap"
										className="min-h-[44px]"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Jenis Kelamin</Label>
										<Select value={jk} onValueChange={setJk}>
											<SelectTrigger className="w-full min-h-[44px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(JK).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Umur</Label>
										<Input
											type="number"
											value={umur}
											onChange={(e) => setUmur(Number(e.target.value))}
											className="min-h-[44px]"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Pendidikan</Label>
										<Select value={pendidikan} onValueChange={setPendidikan}>
											<SelectTrigger className="w-full min-h-[44px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(PENDIDIKAN).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Pekerjaan</Label>
										<Select value={pekerjaan} onValueChange={setPekerjaan}>
											<SelectTrigger className="w-full min-h-[44px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(PEKERJAAN).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							{/* Service Group */}
							<div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
								<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Layanan yang Dinilai
								</p>
								<div className="space-y-2">
									<Label>
										Layanan <span className="text-destructive">*</span>
									</Label>
									<Select
										value={layananId ? String(layananId) : ""}
										onValueChange={(v) => setLayananId(Number(v))}
									>
										<SelectTrigger className="w-full min-h-[44px]">
											<SelectValue placeholder="Pilih layanan..." />
										</SelectTrigger>
										<SelectContent>
											{layananList.map((l) => (
												<SelectItem
													key={l.layananId}
													value={String(l.layananId)}
												>
													{l.nama}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{error && (
								<div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
									<p className="text-sm font-medium text-destructive">
										{error}
									</p>
								</div>
							)}
							<Button
								onClick={handleNextStep}
								className="w-full min-h-[44px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 font-semibold"
							>
								Lanjut ke Survey
							</Button>
						</CardContent>
					</Card>
				)}

				{step === 2 && (
					<div className="space-y-4">
						<Card className="glass-card border-t-4 border-t-indigo-500 shadow-lg shadow-indigo-100/50">
							<CardHeader className="pb-4">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-200">
										<ClipboardList className="size-5 text-white" />
									</div>
									<div className="flex-1">
										<CardTitle className="text-xl">
											{activeForm?.name ?? "Survey"}
										</CardTitle>
										<p className="text-sm text-muted-foreground mt-0.5">
											{answeredCount} dari {totalQuestions} pertanyaan dijawab
										</p>
									</div>
								</div>
								{/* Progress bar */}
								<div className="mt-3 space-y-1">
									<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
										<div
											className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
											style={{ width: `${progressPct}%` }}
										/>
									</div>
									<p className="text-xs text-right text-muted-foreground">
										{Math.round(progressPct)}% selesai
									</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{activeQuestions.map((q, idx) => (
									<div
										key={q.formQuestionId}
										className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-3"
									>
										<div className="flex gap-3">
											<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-indigo-700">
												{idx + 1}
											</span>
											<p className="font-medium text-sm leading-relaxed pt-0.5">
												{q.text}
											</p>
										</div>
										<RadioGroup
											value={
												surveyAnswers[q.formQuestionId] != null
													? String(surveyAnswers[q.formQuestionId])
													: undefined
											}
											onValueChange={(val) =>
												setSurveyAnswers((prev) => ({
													...prev,
													[q.formQuestionId]: Number(val),
												}))
											}
											className="grid grid-cols-2 gap-2"
										>
											{[1, 2, 3, 4].map((val) => {
												const isSelected =
													surveyAnswers[q.formQuestionId] === val;
												return (
													<Label
														key={val}
														className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border-2 p-3 font-normal transition-all duration-200 ${
															isSelected
																? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm shadow-indigo-100"
																: "border-border hover:border-indigo-300 hover:bg-muted/50"
														}`}
													>
														<RadioGroupItem
															value={String(val)}
															className={
																isSelected
																	? "border-indigo-500 text-indigo-600"
																	: ""
															}
														/>
														<span
															className={`text-sm font-medium ${isSelected ? "text-indigo-700" : ""}`}
														>
															{val} — {ANSWER_POIN[val]}
														</span>
													</Label>
												);
											})}
										</RadioGroup>
									</div>
								))}

								<div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-2">
									<Label htmlFor="saran-textarea" className="font-medium">
										Saran &amp; Masukan{" "}
										<span className="text-muted-foreground font-normal">
											(opsional)
										</span>
									</Label>
									<Textarea
										value={saran}
										onChange={(e) => setSaran(e.target.value)}
										placeholder="Tuliskan saran atau masukan Anda..."
										className="min-h-[100px] resize-none"
									/>
								</div>

								{error && (
									<div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
										<p className="text-sm font-medium text-destructive">
											{error}
										</p>
									</div>
								)}

								<div className="flex gap-3">
									<Button
										variant="outline"
										onClick={() => setStep(1)}
										className="min-h-[44px] px-6"
									>
										Kembali
									</Button>
									<Button
										onClick={handleSubmit}
										className="flex-1 min-h-[44px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 font-semibold disabled:opacity-60"
										disabled={submitMut.isPending}
									>
										{submitMut.isPending ? "Menyimpan..." : "Kirim Survey"}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{step === 3 && (
					<Card className="glass-card border-t-4 border-t-emerald-500 shadow-lg shadow-emerald-100/50 overflow-hidden">
						<div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-8 pt-12 pb-8 text-center">
							<div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 shadow-xl shadow-emerald-200">
								<CheckCircle2 className="size-12 text-white" strokeWidth={2} />
							</div>
							<h2 className="mt-6 text-3xl font-bold gradient-text">
								Terima Kasih!
							</h2>
							<p className="mt-2 text-base text-muted-foreground">
								Terima kasih atas partisipasi Anda
							</p>
						</div>
						<CardContent className="py-8 text-center space-y-4">
							<p className="text-muted-foreground max-w-sm mx-auto">
								Survey Anda telah berhasil disimpan. Masukan Anda sangat berarti
								untuk meningkatkan kualitas pelayanan kami.
							</p>
							<Button
								onClick={() => navigate({ to: "/" })}
								className="min-h-[44px] px-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 font-semibold"
							>
								Kembali ke Beranda
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
			<PublicFooter />
		</div>
	);
}
