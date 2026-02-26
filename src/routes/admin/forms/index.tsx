import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { List, Pencil, Plus, Trash2 } from "lucide-react";
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
import { createForm, deleteForm, getForms, updateForm } from "@/server/forms";

export const Route = createFileRoute("/admin/forms/")({
	component: FormsPage,
});

type FormRow = {
	formId: number;
	name: string | null;
	desc: string | null;
	order: number | null;
	active: number | null;
};

function FormsPage() {
	const queryClient = useQueryClient();
	const { data: forms = [] } = useQuery({
		queryKey: ["forms"],
		queryFn: () => getForms(),
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<FormRow | null>(null);
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [order, setOrder] = useState(0);
	const [active, setActive] = useState(1);

	const createMutation = useMutation({
		mutationFn: createForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
			resetDialog();
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
			resetDialog();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
		},
	});

	function resetDialog() {
		setDialogOpen(false);
		setEditing(null);
		setName("");
		setDesc("");
		setOrder(0);
		setActive(1);
	}

	function openEdit(form: FormRow) {
		setEditing(form);
		setName(form.name ?? "");
		setDesc(form.desc ?? "");
		setOrder(form.order ?? 0);
		setActive(form.active ?? 1);
		setDialogOpen(true);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (editing) {
			updateMutation.mutate({
				data: { formId: editing.formId, name, desc, order, active },
			});
		} else {
			createMutation.mutate({ data: { name, desc, order, active } });
		}
	}

	const columns: ColumnDef<FormRow>[] = [
		{ accessorKey: "formId", header: "ID" },
		{ accessorKey: "name", header: "Nama" },
		{ accessorKey: "desc", header: "Deskripsi" },
		{ accessorKey: "order", header: "Urutan" },
		{
			accessorKey: "active",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.active ? "default" : "secondary"}>
					{row.original.active ? "Aktif" : "Nonaktif"}
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
							to="/admin/forms/$formId/questions"
							params={{
								formId: String(row.original.formId),
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
							deleteMutation.mutate({
								data: row.original.formId,
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
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Forms</h1>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => resetDialog()}>
							<Plus className="mr-2 size-4" />
							Tambah Form
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editing ? "Edit Form" : "Tambah Form"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Nama</Label>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Deskripsi</Label>
								<Input value={desc} onChange={(e) => setDesc(e.target.value)} />
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
										onChange={(e) => setActive(Number(e.target.value))}
									>
										<option value={1}>Aktif</option>
										<option value={0}>Nonaktif</option>
									</select>
								</div>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={createMutation.isPending || updateMutation.isPending}
							>
								{editing ? "Simpan" : "Tambah"}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={forms as FormRow[]}
				searchKey="name"
				searchPlaceholder="Cari form..."
			/>
		</div>
	);
}
