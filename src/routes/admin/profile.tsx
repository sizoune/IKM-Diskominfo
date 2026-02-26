import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { data: session } = authClient.useSession();
	const [name, setName] = useState(session?.user?.name ?? "");
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	async function handleUpdateProfile(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setMessage("");

		try {
			await authClient.updateUser({ name });
			setMessage("Profil berhasil diperbarui.");
		} catch {
			setMessage("Gagal memperbarui profil.");
		} finally {
			setSaving(false);
		}
	}

	if (!session?.user) {
		return <div>Memuat...</div>;
	}

	return (
		<div className="max-w-lg space-y-6">
			<h1 className="text-2xl font-bold">Profile</h1>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Informasi Akun</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Username</span>
						<span>{session.user.username ?? "-"}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Email</span>
						<span>{session.user.email}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Role</span>
						<span>{session.user.role ?? "user"}</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Edit Profil</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleUpdateProfile} className="space-y-4">
						<div className="space-y-2">
							<Label>Nama</Label>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						{message && (
							<p className="text-sm text-muted-foreground">{message}</p>
						)}
						<Button type="submit" disabled={saving}>
							{saving ? "Menyimpan..." : "Simpan"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
