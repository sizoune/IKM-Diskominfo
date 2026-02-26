import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
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
import { getFormById } from "@/server/forms";
import { getActiveLayanan } from "@/server/layanan";
import { getQuestionsByFormId } from "@/server/questions";
import { submitSurvey } from "@/server/survey-submit";

export const Route = createFileRoute("/guest/survey/$formId")({
	head: () => ({
		meta: [
			{ title: "Formulir Survey — IKM Diskominfo" },
			{
				name: "description",
				content:
					"Isi formulir survey kepuasan masyarakat terhadap pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:title",
				content: "Formulir Survey — IKM Diskominfo",
			},
			{
				property: "og:description",
				content:
					"Isi formulir survey kepuasan masyarakat terhadap pelayanan publik Dinas Komunikasi dan Informatika.",
			},
			{
				property: "og:url",
				content: "https://ikm.kominfo.go.id/guest/survey",
			},
		],
	}),
	component: SurveyFormPage,
});

function StepIndicator({ current }: { current: number }) {
	return (
		<div className="mb-6 flex gap-2">
			{[1, 2, 3].map((s) => (
				<div
					key={s}
					className={`h-1.5 flex-1 rounded-full transition-colors ${
						s <= current
							? "bg-gradient-to-r from-indigo-500 to-violet-500"
							: "bg-muted"
					}`}
				/>
			))}
		</div>
	);
}

function SurveyFormPage() {
	const { formId: formIdParam } = Route.useParams();
	const formId = Number(formIdParam);
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

	const { data: form } = useQuery({
		queryKey: ["form-by-id", formId],
		queryFn: () => getFormById({ data: formId }),
		enabled: formId > 0,
	});

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

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />
			<div className="flex-1 container mx-auto max-w-2xl px-4 py-8">
				<StepIndicator current={step} />

				{step === 1 && (
					<Card className="border-t-4 border-t-indigo-500 glass-card">
						<CardHeader>
							<CardTitle>Informasi Responden</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Status</Label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger className="w-full">
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
									/>
								</div>
							)}
							<div className="space-y-2">
								<Label>Nama Lengkap</Label>
								<Input
									value={nama}
									onChange={(e) => setNama(e.target.value)}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Jenis Kelamin</Label>
									<Select value={jk} onValueChange={setJk}>
										<SelectTrigger className="w-full">
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
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Pendidikan</Label>
									<Select value={pendidikan} onValueChange={setPendidikan}>
										<SelectTrigger className="w-full">
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
										<SelectTrigger className="w-full">
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
							<div className="space-y-2">
								<Label>Layanan</Label>
								<Select
									value={layananId ? String(layananId) : ""}
									onValueChange={(v) => setLayananId(Number(v))}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih layanan..." />
									</SelectTrigger>
									<SelectContent>
										{layananList.map((l) => (
											<SelectItem key={l.layananId} value={String(l.layananId)}>
												{l.nama}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{error && <p className="text-sm text-destructive">{error}</p>}
							<Button
								onClick={handleNextStep}
								className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
							>
								Lanjut ke Survey
							</Button>
						</CardContent>
					</Card>
				)}

				{step === 2 && (
					<div className="space-y-4">
						<Card className="border-t-4 border-t-indigo-500 glass-card">
							<CardHeader>
								<CardTitle>{form?.name ?? "Survey"}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{questions
									.filter((q) => q.active === "1")
									.map((q, idx) => (
										<div key={q.formQuestionId} className="space-y-3">
											<p className="font-medium">
												{idx + 1}. {q.text}
											</p>
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
												{[1, 2, 3, 4].map((val) => (
													<Label
														key={val}
														className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border p-3 font-normal transition-colors ${
															surveyAnswers[q.formQuestionId] === val
																? "border-indigo-500 bg-indigo-50"
																: "hover:bg-muted"
														}`}
													>
														<RadioGroupItem value={String(val)} />
														<span className="text-sm">
															{val} - {ANSWER_POIN[val]}
														</span>
													</Label>
												))}
											</RadioGroup>
										</div>
									))}

								<div className="space-y-2">
									<Label>Saran (opsional)</Label>
									<Textarea
										value={saran}
										onChange={(e) => setSaran(e.target.value)}
										placeholder="Masukkan saran..."
									/>
								</div>
								{error && <p className="text-sm text-destructive">{error}</p>}
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => setStep(1)}>
										Kembali
									</Button>
									<Button
										onClick={handleSubmit}
										className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
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
					<Card className="border-t-4 border-t-emerald-500 glass-card">
						<CardContent className="py-12 text-center space-y-4">
							<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
								<CheckCircle2 className="size-8 text-emerald-500" />
							</div>
							<h2 className="text-2xl font-bold gradient-text">
								Terima Kasih!
							</h2>
							<p className="text-muted-foreground">
								Survey Anda telah berhasil disimpan.
							</p>
							<Button
								onClick={() => navigate({ to: "/" })}
								className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
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
