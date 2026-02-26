import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const baseUrl = "https://ikm-diskominfo.tabalongkab.go.id";
				const urls = [
					{ loc: "/", priority: "1.0", changefreq: "weekly" },
					{ loc: "/guest/ikm", priority: "0.8", changefreq: "daily" },
					{ loc: "/guest/survey", priority: "0.8", changefreq: "monthly" },
				]

				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

				return new Response(xml, {
					headers: {
						"Content-Type": "application/xml",
						"Cache-Control": "public, max-age=3600",
					},
				})
			},
		},
	},
});
