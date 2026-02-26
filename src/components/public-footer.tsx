import { Building2 } from "lucide-react";

export function PublicFooter() {
	return (
		<footer className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-white">
			<div className="container mx-auto px-4 py-10">
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex items-center gap-2.5">
						<Building2 className="size-6" />
						<span className="text-lg font-bold">IKM Diskominfo</span>
					</div>
					<p className="max-w-md text-sm text-slate-400">
						Indeks Kepuasan Masyarakat — Dinas Komunikasi dan Informatika
					</p>
					<div className="mt-4 w-full max-w-md border-t border-white/10 pt-4 text-xs text-slate-500">
						&copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika.
						Hak cipta dilindungi.
					</div>
				</div>
			</div>
		</footer>
	);
}
