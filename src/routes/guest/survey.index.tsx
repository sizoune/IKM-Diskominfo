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
					const bubbleClass = isCompleted
						? "bg-[var(--navy)] text-[var(--amber)]"
						: isActive
							? "bg-[var(--amber)] text-[var(--navy)] ring-4 ring-amber-200"
							: "bg-slate-100 text-slate-500 border border-slate-200";
					const labelClass = isCompleted
						? "text-[var(--navy)]"
						: isActive
							? "text-amber-700"
							: "text-muted-foreground";
					return (
						<div key={s} className="flex flex-1 items-center">
							<div className="flex flex-col items-center gap-1.5">
								<div
									className={`flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${bubbleClass}`}
								>
									{isCompleted ? <Check className="size-4 stroke-[3]" /> : s}
								</div>
								<span
									className={`whitespace-nowrap text-xs font-bold ${labelClass}`}
								>
									{STEP_LABELS[idx]}
								</span>
							</div>
							{idx < 2 ? (
								<div
									className={`mx-2 mb-5 h-0.5 flex-1 rounded-full transition-all duration-500 ${
										s < current ? "bg-[var(--navy)]" : "bg-slate-200"
									}`}
								/>
							) : null}
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

	const [status, setStatus] = useState("NON_ASN");
	const [nama, setNama] = useState("");
	const [nip, setNip] = useState("");
	const [jk, setJk] = useState("L");
	const [umur, setUmur] = useState(25);
	const [pendidikan, setPendidikan] = useState("SMA");
	const [pekerjaan, setPekerjaan] = useState("LAINNYA");
	const [layananId, setLayananId] = useState(0);
	const [saran, setSaran] = useState("");
	const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>(
		{},
	);

	const { data: formsList = [] } = useQuery({
		queryKey: ["forms-active"],
		queryFn: () => getForms(),
	});
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
		<div className="flex min-h-screen flex-col bg-background">
			<PublicNavbar />
			<div className="container mx-auto max-w-2xl flex-1 px-4 py-8">
				<StepIndicator current={step} />

				{step === 1 && (
					<Card className="overflow-hidden border-t-4 border-t-[var(--amber)] border-x border-b border-slate-200 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="grid size-10 place-items-center rounded-lg bg-[var(--navy)] text-[var(--amber)]">
									<User className="size-5" />
								</div>
								<div>
									<CardTitle className="text-base font-extrabold text-[var(--navy)]">
										Informasi Responden
									</CardTitle>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Lengkapi data diri Anda untuk melanjutkan
									</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Informasi Pribadi
								</p>
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Status
									</Label>
									<Select value={status} onValueChange={setStatus}>
										<SelectTrigger className="min-h-[44px] w-full">
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
										<Label className="text-xs font-bold text-[var(--navy)]">
											NIP
										</Label>
										<Input
											value={nip}
											onChange={(e) => setNip(e.target.value)}
											placeholder="Masukkan NIP"
											className="min-h-[44px]"
										/>
									</div>
								)}
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Nama Lengkap <span className="text-[var(--red)]">*</span>
									</Label>
									<Input
										value={nama}
										onChange={(e) => setNama(e.target.value)}
										placeholder="Masukkan nama lengkap"
										className="min-h-[44px]"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Jenis Kelamin
										</Label>
										<Select value={jk} onValueChange={setJk}>
											<SelectTrigger className="min-h-[44px] w-full">
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
										<Label className="text-xs font-bold text-[var(--navy)]">
											Umur
										</Label>
										<Input
											type="number"
											value={umur}
											onChange={(e) => setUmur(Number(e.target.value))}
											className="min-h-[44px]"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs font-bold text-[var(--navy)]">
											Pendidikan
										</Label>
										<Select value={pendidikan} onValueChange={setPendidikan}>
											<SelectTrigger className="min-h-[44px] w-full">
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
										<Label className="text-xs font-bold text-[var(--navy)]">
											Pekerjaan
										</Label>
										<Select value={pekerjaan} onValueChange={setPekerjaan}>
											<SelectTrigger className="min-h-[44px] w-full">
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

							<div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]">
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Layanan yang Dinilai
								</p>
								<div className="space-y-2">
									<Label className="text-xs font-bold text-[var(--navy)]">
										Layanan <span className="text-[var(--red)]">*</span>
									</Label>
									<Select
										value={layananId ? String(layananId) : ""}
										onValueChange={(v) => setLayananId(Number(v))}
									>
										<SelectTrigger className="min-h-[44px] w-full">
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
								<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
									<p className="text-sm font-medium text-[var(--red)]">
										{error}
									</p>
								</div>
							)}
							<Button
								onClick={handleNextStep}
								className="min-h-[44px] w-full bg-[var(--navy)] font-bold text-white hover:bg-[var(--navy-2)]"
							>
								Lanjut ke Survey →
							</Button>
						</CardContent>
					</Card>
				)}

				{step === 2 && (
					<Card className="overflow-hidden border-t-4 border-t-[var(--amber)] border-x border-b border-slate-200 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="grid size-10 place-items-center rounded-lg bg-[var(--navy)] text-[var(--amber)]">
									<ClipboardList className="size-5" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-base font-extrabold text-[var(--navy)]">
										{activeForm?.name ?? "Survey"}
									</CardTitle>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{answeredCount} dari {totalQuestions} pertanyaan dijawab
									</p>
								</div>
							</div>
							<div className="mt-3 space-y-1">
								<div className="flex justify-between text-[10px] font-bold text-muted-foreground">
									<span>Progress</span>
									<span className="text-[var(--navy)]">
										{Math.round(progressPct)}% selesai
									</span>
								</div>
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full rounded-full bg-gradient-to-r from-[var(--navy)] to-[var(--blue)] transition-all duration-500"
										style={{ width: `${progressPct}%` }}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{activeQuestions.map((q, idx) => (
								<div
									key={q.formQuestionId}
									className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
								>
									<div className="flex gap-3">
										<span className="grid size-6 shrink-0 place-items-center rounded-md bg-[var(--amber-soft)] text-xs font-black text-amber-800">
											{idx + 1}
										</span>
										<p className="pt-0.5 text-sm font-semibold leading-relaxed text-[var(--navy)]">
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
													className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border-2 p-3 font-normal transition-all duration-200 ${
														isSelected
															? "border-[var(--amber)] bg-[var(--amber-soft)] font-bold text-amber-900"
															: "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
													}`}
												>
													<RadioGroupItem
														value={String(val)}
														className={
															isSelected
																? "border-[var(--amber)] text-[var(--amber)]"
																: ""
														}
													/>
													<span className="text-sm font-medium">
														{val} — {ANSWER_POIN[val]}
													</span>
												</Label>
											);
										})}
									</RadioGroup>
								</div>
							))}

							<div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
								<Label
									htmlFor="saran-textarea"
									className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--blue)]"
								>
									<span className="h-0.5 w-3 bg-[var(--amber)]" />
									Saran &amp; Masukan{" "}
									<span className="ml-1 font-medium normal-case tracking-normal text-muted-foreground">
										(opsional)
									</span>
								</Label>
								<Textarea
									id="saran-textarea"
									value={saran}
									onChange={(e) => setSaran(e.target.value)}
									placeholder="Tuliskan saran atau masukan Anda..."
									className="min-h-[100px] resize-none"
								/>
							</div>

							{error && (
								<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
									<p className="text-sm font-medium text-[var(--red)]">
										{error}
									</p>
								</div>
							)}

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => setStep(1)}
									className="min-h-[44px] border-slate-200 px-5 font-bold text-[var(--navy)]"
								>
									← Kembali
								</Button>
								<Button
									onClick={handleSubmit}
									className="min-h-[44px] flex-1 bg-[var(--navy)] font-bold text-white hover:bg-[var(--navy-2)] disabled:opacity-60"
									disabled={submitMut.isPending}
								>
									{submitMut.isPending ? "Menyimpan..." : "Kirim Survey →"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{step === 3 && (
					<Card className="overflow-hidden border-t-4 border-t-emerald-500 border-x border-b border-slate-200 shadow-sm">
						<div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-8 pt-12 pb-6 text-center">
							<div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-200">
								<CheckCircle2 className="size-10 text-white" strokeWidth={2} />
							</div>
							<h2 className="mt-5 text-2xl font-black text-[var(--navy)]">
								Terima Kasih!
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Survey Anda berhasil terekam dalam sistem IKM
							</p>
						</div>
						<CardContent className="space-y-4 py-7 text-center">
							<p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-700">
								Masukan Anda sangat berarti untuk meningkatkan kualitas
								pelayanan Diskominfo Kabupaten Tabalong. Hasil agregat akan
								tampil di halaman Hasil IKM.
							</p>
							<div className="flex flex-wrap justify-center gap-3">
								<Button
									variant="outline"
									onClick={() => navigate({ to: "/guest/ikm" })}
									className="min-h-[44px] border-slate-200 px-5 font-bold text-[var(--navy)]"
								>
									Lihat Hasil IKM
								</Button>
								<Button
									onClick={() => navigate({ to: "/" })}
									className="min-h-[44px] bg-[var(--navy)] px-6 font-bold text-white hover:bg-[var(--navy-2)]"
								>
									Kembali ke Beranda
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			<PublicFooter />
		</div>
	);
}
