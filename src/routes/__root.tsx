import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "IKM — Dinas Komunikasi dan Informatika",
			},
			{
				name: "description",
				content:
					"Indeks Kepuasan Masyarakat (IKM) — Sistem survei kepuasan masyarakat terhadap pelayanan publik Dinas Komunikasi dan Informatika Kabupaten Tabalong.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:site_name",
				content: "IKM Diskominfo",
			},
			{
				property: "og:locale",
				content: "id_ID",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "theme-color",
				content: "#4f46e5",
			},
		],
		links: [
			{
				rel: "preload",
				href: appCss,
				as: "style",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
			},
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	component: RootComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id">
			<head>
				<HeadContent />
				<style
					dangerouslySetInnerHTML={{
						__html: `html{visibility:hidden}`,
					}}
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `document.addEventListener('DOMContentLoaded',function(){document.documentElement.style.visibility='visible'})`,
					}}
				/>
			</head>
			<body>
				<TanStackQueryProvider>{children}</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
