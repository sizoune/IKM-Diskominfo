import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, List, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
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
import { getFormById } from "@/server/forms";
import {
	createQuestion,
	deleteQuestion,
	getQuestionsByFormId,
	updateQuestion,
} from "@/server/questions";

export const Route = createFileRoute("/admin/forms/$formId/questions")({
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
		from: "/admin/forms/$formId/questions",
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
	const [questionType, setQuestionType] = useState("radio");
	const [order, setOrder] = useState(0);
	const [active, setActive] = useState("1");

	const createMut = useMutation({
		mutationFn: createQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
			resetDialog();
		},
	});

	const updateMut = useMutation({
		mutationFn: updateQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
			resetDialog();
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteQuestion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions", formId] });
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setText("");
		setKode("");
		setQuestionType("radio");
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
		{ accessorKey: "kode", header: "Kode" },
		{
			accessorKey: "text",
			header: "Pertanyaan",
			cell: ({ row }) => (
				<span className="line-clamp-2">{row.original.text}</span>
			),
		},
		{ accessorKey: "questionType", header: "Tipe" },
		{ accessorKey: "order", header: "Urutan" },
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
						onClick={() =>
							deleteMut.mutate({
								data: row.original.formQuestionId,
							})
						}
					>
						<Trash2 className="size-4" />
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
								<textarea
									className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
									value={text}
									onChange={(e) => setText(e.target.value)}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Kode</Label>
									<Input
										value={kode}
										onChange={(e) => setKode(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label>Tipe</Label>
									<Input
										value={questionType}
										onChange={(e) => setQuestionType(e.target.value)}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Urutan</Label>
									<Input
										type="number"
										value={order}
										onChange={(e) => setOrder(Number(e.target.value))}
									/>
								</div>
								<div className="space-y-2">
									<Label>Aktif</Label>
									<select
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										value={active}
										onChange={(e) => setActive(e.target.value)}
									>
										<option value="1">Aktif</option>
										<option value="0">Nonaktif</option>
									</select>
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
		</div>
	);
}
