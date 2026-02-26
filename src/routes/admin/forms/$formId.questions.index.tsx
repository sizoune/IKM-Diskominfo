import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, List, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getFormById } from "@/server/forms";
import {
	createQuestion,
	deleteQuestion,
	getQuestionsByFormId,
	updateQuestion,
} from "@/server/questions";

export const Route = createFileRoute("/admin/forms/$formId/questions/")({
	component: QuestionsPage,
});

type QuestionRow = {
	formQuestionId: number;
	formId: number | null;
	questionType: string;
	kode: string | null;
	active: string | null;
	order: number | null;
	text: string | null;
};

function QuestionsPage() {
	const { formId: formIdStr } = useParams({
		from: "/admin/forms/$formId/questions/",
	});
	const formId = Number(formIdStr);
	const queryClient = useQueryClient();

	const { data: form } = useQuery({
		queryKey: ["form", formId],
		queryFn: () => getFormById({ data: formId }),
	});

	const { data: questions = [] } = useQuery({
		queryKey: ["questions", formId],
		queryFn: () => getQuestionsByFormId({ data: formId }),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<QuestionRow | null>(null);
	const [text, setText] = useState("");
	const [kode, setKode] = useState("");
	const [questionType, setQuestionType] = useState("choice");
	const [order, setOrder] = useState(0);
	const [active, setActive] = useState("1");
	const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

	const createMut = useMutation({
		mutationFn: createQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
			resetDialog();
			toast.success("Pertanyaan berhasil ditambahkan");
		},
		onError: () => {
			toast.error("Gagal menambahkan pertanyaan");
		},
	});

	const updateMut = useMutation({
		mutationFn: updateQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
			resetDialog();
			toast.success("Pertanyaan berhasil diperbarui");
		},
		onError: () => {
			toast.error("Gagal memperbarui pertanyaan");
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
			toast.success("Pertanyaan berhasil dihapus");
		},
		onError: () => {
			toast.error("Gagal menghapus pertanyaan");
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setText("");
		setKode("");
		setQuestionType("choice");
		setOrder(0);
		setActive("1");
	}

	function openEdit(q: QuestionRow) {
		setEditing(q);
		setText(q.text ?? "");
		setKode(q.kode ?? "");
		setQuestionType(q.questionType);
		setOrder(q.order ?? 0);
		setActive(q.active ?? "1");
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (editing) {
			updateMut.mutate({
				data: {
					formQuestionId: editing.formQuestionId,
					questionType,
					kode,
					active,
					order,
					text,
				},
			});
		} else {
			createMut.mutate({
				data: { formId, questionType, kode, active, order, text },
			});
		}
	}

	const columns: ColumnDef<QuestionRow>[] = [
		{ accessorKey: "kode", header: "Kode", size: 80 },
		{
			accessorKey: "text",
			header: "Pertanyaan",
			size: 400,
			cell: ({ row }) => (
				<span className="line-clamp-2 break-words">
					{row.original.text}
				</span>
			),
		},
		{ accessorKey: "questionType", header: "Tipe", size: 80 },
		{ accessorKey: "order", header: "Urutan", size: 70 },
		{
			accessorKey: "active",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.active === "1" ? "default" : "secondary"}>
					{row.original.active === "1" ? "Aktif" : "Nonaktif"}
				</Badge>
			),
		},
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<div className="flex gap-1">
					<Button variant="ghost" size="icon" asChild>
						<Link
							to="/admin/forms/$formId/questions/$questionId/choices"
							params={{
								formId: formIdStr,
								questionId: String(row.original.formQuestionId),
							}}
						>
							<List className="size-4" />
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => openEdit(row.original)}
					>
						<Pencil className="size-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setDeleteTarget(row.original.formQuestionId)}
					>
						<Trash2 className="size-4 text-destructive" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Link to="/admin/forms" className="hover:text-foreground">
					Forms
				</Link>
				<ChevronRight className="size-4" />
				<span className="text-foreground">{form?.name ?? "..."}</span>
				<ChevronRight className="size-4" />
				<span className="text-foreground">Pertanyaan</span>
			</div>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Pertanyaan - {form?.name}</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Pertanyaan
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Pertanyaan</Label>
								<Textarea
									value={text}
									onChange={(e) => setText(e.target.value)}
									placeholder="Masukkan pertanyaan..."
									required
								/>
							</div>
							{editing && (
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label>Kode</Label>
										<Input
											value={kode}
											onChange={(e) => setKode(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label>Urutan</Label>
										<Input
											type="number"
											value={order}
											onChange={(e) => setOrder(Number(e.target.value))}
										/>
									</div>
								</div>
							)}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Tipe</Label>
									<Select value={questionType} onValueChange={setQuestionType}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="choice">Pilihan</SelectItem>
											<SelectItem value="multiple-choice">
												Pilihan Ganda
											</SelectItem>
											<SelectItem value="text">Teks</SelectItem>
											<SelectItem value="number">Angka</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Aktif</Label>
									<Select value={active} onValueChange={setActive}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">Aktif</SelectItem>
											<SelectItem value="0">Nonaktif</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={createMut.isPending || updateMut.isPending}
							>
								{editing ? "Simpan" : "Tambah"}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={questions as QuestionRow[]}
				searchKey="text"
				searchPlaceholder="Cari pertanyaan..."
			/>
			<AlertDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Pertanyaan?</AlertDialogTitle>
						<AlertDialogDescription>
							Pertanyaan yang dihapus tidak dapat dikembalikan. Semua pilihan
							jawaban terkait juga akan dihapus.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={() => {
								if (deleteTarget !== null) {
									deleteMut.mutate({ data: deleteTarget });
									setDeleteTarget(null);
								}
							}}
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
