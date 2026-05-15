import { Link } from "@tanstack/react-router";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const ACTIVE_LINK_CLASS =
	"relative flex min-h-[44px] items-center text-sm font-bold text-[var(--navy)] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[var(--amber)]";

export function PublicNavbar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="top-stripe-kominfo" aria-hidden />
			<header className="sticky top-0 z-50 border-b border-slate-100 bg-white/92 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link to="/" className="flex items-center gap-3">
						<img
							src="/komdigi.png"
							alt="Logo Diskominfo Tabalong"
							className="size-8 object-contain"
						/>
						<div className="leading-tight">
							<div className="text-[11px] font-extrabold tracking-wide text-[var(--navy)]">
								DISKOMINFO TABALONG
							</div>
							<div className="text-[10px] text-muted-foreground">
								Indeks Kepuasan Masyarakat
							</div>
						</div>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							to="/guest/survey"
							className="relative flex min-h-[44px] items-center text-sm font-medium text-slate-700 transition-colors hover:text-[var(--navy)]"
							activeProps={{
								className: ACTIVE_LINK_CLASS,
							}}
						>
							Survey
						</Link>
						<Link
							to="/guest/ikm"
							className="relative flex min-h-[44px] items-center text-sm font-medium text-slate-700 transition-colors hover:text-[var(--navy)]"
							activeProps={{
								className: ACTIVE_LINK_CLASS,
							}}
						>
							Hasil IKM
						</Link>
						<Button
							asChild
							size="sm"
							className="min-h-[44px] rounded-full bg-[var(--navy)] px-4 font-bold text-white hover:bg-[var(--navy-2)]"
						>
							<Link to="/login">
								<LogIn className="mr-2 size-4" />
								Login
							</Link>
						</Button>
					</nav>

					{/* Mobile hamburger */}
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="min-h-[44px] min-w-[44px] text-[var(--navy)] hover:bg-slate-100 md:hidden"
							>
								<Menu className="size-5" />
								<span className="sr-only">Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-72 border-slate-100 bg-white/98 backdrop-blur-xl"
						>
							<SheetHeader>
								<SheetTitle className="flex items-center gap-2.5">
									<img
										src="/komdigi.png"
										alt="Logo Diskominfo Tabalong"
										className="size-7 object-contain"
									/>
									<span className="font-extrabold text-[var(--navy)]">
										IKM Diskominfo
									</span>
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-1 px-4">
								<SheetClose asChild>
									<Link
										to="/guest/survey"
										className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--navy)]"
										onClick={() => setOpen(false)}
									>
										Survey
									</Link>
								</SheetClose>
								<SheetClose asChild>
									<Link
										to="/guest/ikm"
										className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[var(--navy)]"
										onClick={() => setOpen(false)}
									>
										Hasil IKM
									</Link>
								</SheetClose>
								<SheetClose asChild>
									<Link
										to="/login"
										className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--navy)] px-3 text-sm font-bold text-white transition-colors hover:bg-[var(--navy-2)]"
										onClick={() => setOpen(false)}
									>
										<LogIn className="size-4" />
										Login
									</Link>
								</SheetClose>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>
		</>
	);
}
