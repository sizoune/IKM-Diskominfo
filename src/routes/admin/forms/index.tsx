import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { List, Pencil, Plus, Trash2 } from "lucide-react";
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
	const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

	const createMutation = useMutation({
		mutationFn: createForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
			resetDialog();
			toast.success("Form berhasil ditambahkan");
		},
		onError: () => {
			toast.error("Gagal menambahkan form");
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
			resetDialog();
			toast.success("Form berhasil diperbarui");
		},
		onError: () => {
			toast.error("Gagal memperbarui form");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteForm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["forms"] });
			toast.success("Form berhasil dihapus");
		},
		onError: () => {
			toast.error("Gagal menghapus form");
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
		{ accessorKey: "formId", header: "ID", size: 60 },
		{ accessorKey: "name", header: "Nama", size: 150 },
		{
			accessorKey: "desc",
			header: "Deskripsi",
			size: 300,
			cell: ({ row }) => (
				<span className="line-clamp-2 break-words">
					{row.original.desc}
				</span>
			),
		},
		{ accessorKey: "order", header: "Urutan", size: 70 },
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
						onClick={() => setDeleteTarget(row.original.formId)}
					>
						<Trash2 className="size-4 text-destructive" />
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
							<div className={editing ? "grid grid-cols-2 gap-4" : ""}>
								{editing && (
									<div className="space-y-2">
										<Label>Urutan</Label>
										<Input
											type="number"
											value={order}
											onChange={(e) => setOrder(Number(e.target.value))}
										/>
									</div>
								)}
								<div className="space-y-2">
									<Label>Aktif</Label>
									<Select
										value={String(active)}
										onValueChange={(v) => setActive(Number(v))}
									>
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
			<AlertDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Form?</AlertDialogTitle>
						<AlertDialogDescription>
							Form yang dihapus tidak dapat dikembalikan. Semua pertanyaan dan
							pilihan terkait juga akan dihapus.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={() => {
								if (deleteTarget !== null) {
									deleteMutation.mutate({ data: deleteTarget });
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
