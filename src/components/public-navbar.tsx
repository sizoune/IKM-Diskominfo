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

export function PublicNavbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 border-b border-indigo-100/60 shadow-sm">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-3">
					<img
						src="/komdigi.png"
						alt="Logo Diskominfo Tabalong"
						className="size-8 object-contain"
					/>
					<div className="flex items-baseline gap-1.5">
						<span className="text-lg font-bold leading-tight text-indigo-900 tracking-tight">
							IKM
						</span>
						<span className="text-sm font-medium text-indigo-500 leading-tight">
							Diskominfo
						</span>
					</div>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-6 md:flex">
					<Link
						to="/guest/survey"
						className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-indigo-600"
						activeProps={{ className: "text-indigo-600 font-semibold" }}
					>
						Survey
					</Link>
					<Link
						to="/guest/ikm"
						className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-indigo-600"
						activeProps={{ className: "text-indigo-600 font-semibold" }}
					>
						Hasil IKM
					</Link>
					<Button
						asChild
						size="sm"
						className="min-h-[44px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200"
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
							className="min-h-[44px] min-w-[44px] text-foreground hover:bg-indigo-50 md:hidden"
						>
							<Menu className="size-5" />
							<span className="sr-only">Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="w-72 backdrop-blur-xl bg-white/95 border-indigo-100/60"
					>
						<SheetHeader>
							<SheetTitle className="flex items-center gap-2.5 text-foreground">
								<img
									src="/komdigi.png"
									alt="Logo Diskominfo Tabalong"
									className="size-6 object-contain"
								/>
								<span className="font-bold text-indigo-900">IKM</span>
								<span className="text-sm font-medium text-indigo-500">
									Diskominfo
								</span>
							</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col gap-1 px-4">
							<SheetClose asChild>
								<Link
									to="/guest/survey"
									className="min-h-[44px] flex items-center rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
									onClick={() => setOpen(false)}
								>
									Survey
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									to="/guest/ikm"
									className="min-h-[44px] flex items-center rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
									onClick={() => setOpen(false)}
								>
									Hasil IKM
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									to="/login"
									className="mt-2 min-h-[44px] flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 text-sm font-medium text-white transition-colors hover:from-indigo-700 hover:to-violet-700"
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
	);
}
