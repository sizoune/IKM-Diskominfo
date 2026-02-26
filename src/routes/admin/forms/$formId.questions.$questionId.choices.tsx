import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
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
	createChoice,
	deleteChoice,
	getChoicesByQuestionId,
	updateChoice,
} from "@/server/choices";
import { getFormById } from "@/server/forms";
import { getQuestionById } from "@/server/questions";

export const Route = createFileRoute(
	"/admin/forms/$formId/questions/$questionId/choices",
)({
	component: ChoicesPage,
});

type ChoiceRow = {
	choiceId: number;
	formQuestionId: number | null;
	label: string | null;
	value: string | null;
	kode: string | null;
};

function ChoicesPage() {
	const { formId: formIdStr, questionId: questionIdStr } = useParams({
		from: "/admin/forms/$formId/questions/$questionId/choices",
	});
	const formId = Number(formIdStr);
	const questionId = Number(questionIdStr);
	const queryClient = useQueryClient();

	const { data: form } = useQuery({
		queryKey: ["form", formId],
		queryFn: () => getFormById({ data: formId }),
	});

	const { data: question } = useQuery({
		queryKey: ["question", questionId],
		queryFn: () => getQuestionById({ data: questionId }),
	});

	const { data: choicesList = [] } = useQuery({
		queryKey: ["choices", questionId],
		queryFn: () => getChoicesByQuestionId({ data: questionId }),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<ChoiceRow | null>(null);
	const [label, setLabel] = useState("");
	const [value, setValue] = useState("");
	const [kode, setKode] = useState("");

	const createMut = useMutation({
		mutationFn: createChoice,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["choices", questionId],
			});
			resetDialog();
		},
	});

	const updateMut = useMutation({
		mutationFn: updateChoice,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["choices", questionId],
			});
			resetDialog();
		},
	});

	const deleteMut = useMutation({
		mutationFn: deleteChoice,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["choices", questionId],
			});
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setLabel("");
		setValue("");
		setKode("");
	}

	function openEdit(c: ChoiceRow) {
		setEditing(c);
		setLabel(c.label ?? "");
		setValue(c.value ?? "");
		setKode(c.kode ?? "");
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (editing) {
			updateMut.mutate({
				data: { choiceId: editing.choiceId, label, value, kode },
			});
		} else {
			createMut.mutate({
				data: {
					formQuestionId: questionId,
					label,
					value,
					kode,
				},
			});
		}
	}

	const columns: ColumnDef<ChoiceRow>[] = [
		{ accessorKey: "choiceId", header: "ID" },
		{ accessorKey: "kode", header: "Kode" },
		{ accessorKey: "label", header: "Label" },
		{ accessorKey: "value", header: "Nilai" },
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }) => (
				<div className="flex gap-1">
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
								data: row.original.choiceId,
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
				<Link
					to="/admin/forms/$formId/questions"
					params={{ formId: formIdStr }}
					className="hover:text-foreground"
				>
					{form?.name ?? "..."}
				</Link>
				<ChevronRight className="size-4" />
				<span className="text-foreground line-clamp-1 max-w-[200px]">
					{question?.text ?? "..."}
				</span>
				<ChevronRight className="size-4" />
				<span className="text-foreground">Pilihan</span>
			</div>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Pilihan Jawaban</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Pilihan
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editing ? "Edit Pilihan" : "Tambah Pilihan"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Label</Label>
								<Input
									value={label}
									onChange={(e) => setLabel(e.target.value)}
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Nilai</Label>
									<Input
										value={value}
										onChange={(e) => setValue(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label>Kode</Label>
									<Input
										value={kode}
										onChange={(e) => setKode(e.target.value)}
									/>
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
			<DataTable columns={columns} data={choicesList as ChoiceRow[]} />
		</div>
	);
}
