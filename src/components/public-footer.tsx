import { Link } from "@tanstack/react-router";

export function PublicFooter() {
	return (
		<footer className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid gap-10 md:grid-cols-3">
					{/* Brand column */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<img
								src="/komdigi.png"
								alt="Logo Diskominfo Tabalong"
								className="size-10 object-contain"
							/>
							<div>
								<p className="text-base font-bold leading-tight">
									IKM Diskominfo
								</p>
								<p className="text-xs text-indigo-300 leading-tight">
									Dinas Komunikasi dan Informatika Kabupaten Tabalong
								</p>
							</div>
						</div>
						<p className="text-sm text-slate-400 leading-relaxed">
							Indeks Kepuasan Masyarakat — Sistem survei dan penilaian kualitas
							pelayanan publik Dinas Komunikasi dan Informatika.
						</p>
					</div>

					{/* Quick links */}
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">
							Tautan Cepat
						</h3>
						<nav className="flex flex-col gap-2">
							<Link
								to="/guest/survey"
								className="text-sm text-slate-400 transition-colors hover:text-white"
							>
								Survey Kepuasan
							</Link>
							<Link
								to="/guest/ikm"
								className="text-sm text-slate-400 transition-colors hover:text-white"
							>
								Hasil IKM
							</Link>
							<Link
								to="/login"
								className="text-sm text-slate-400 transition-colors hover:text-white"
							>
								Login Admin
							</Link>
						</nav>
					</div>

					{/* Info column */}
					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">
							Tentang
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							Platform ini digunakan untuk mengukur dan meningkatkan kualitas
							layanan publik melalui partisipasi aktif masyarakat.
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
					&copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika
					Kabupaten Tabalong — Hak cipta dilindungi.
				</div>
			</div>
		</footer>
	);
}
