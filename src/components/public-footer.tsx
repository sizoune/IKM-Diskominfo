import { Link } from "@tanstack/react-router";

export function PublicFooter() {
	return (
		<footer className="bg-[#0a1429] text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid gap-10 md:grid-cols-3">
					{/* Brand column */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							{/* TODO: Replace with Diskominfo logo SVG when available */}
							<div className="grid size-10 place-items-center rounded-md bg-[var(--amber)] text-lg font-black text-[var(--navy)]">
								T
							</div>
							<div className="leading-tight">
								<p className="text-sm font-extrabold tracking-wide">
									DISKOMINFO TABALONG
								</p>
								<p className="text-[11px] text-slate-400">
									Indeks Kepuasan Masyarakat
								</p>
							</div>
						</div>
						<p className="max-w-sm text-sm leading-relaxed text-slate-400">
							Sistem survei dan penilaian kualitas pelayanan publik Dinas
							Komunikasi dan Informatika Kabupaten Tabalong.
						</p>
					</div>

					{/* Quick links */}
					<div className="flex flex-col gap-3">
						<h3 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--sky)]">
							Tautan Cepat
						</h3>
						<nav className="flex flex-col gap-2">
							<Link
								to="/guest/survey"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Survey Kepuasan
							</Link>
							<Link
								to="/guest/ikm"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Hasil IKM
							</Link>
							<Link
								to="/login"
								className="text-sm text-slate-300 transition-colors hover:text-white"
							>
								Login Admin
							</Link>
						</nav>
					</div>

					{/* Info column */}
					<div className="flex flex-col gap-3">
						<h3 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--sky)]">
							Tentang
						</h3>
						<p className="text-sm leading-relaxed text-slate-400">
							Platform pengukuran kualitas layanan publik melalui partisipasi
							aktif masyarakat berdasarkan Permenpan RB 14/2017.
						</p>
					</div>
				</div>

				<div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] text-slate-500">
					&copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika
					Kabupaten Tabalong — Hak cipta dilindungi.
				</div>
			</div>
		</footer>
	);
}
