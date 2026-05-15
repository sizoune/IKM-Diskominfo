import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
	it("renders kicker, title, and subtitle", () => {
		render(
			<SectionHeader
				kicker="Layanan Kami"
				title="Sistem penilaian"
				titleAccent="yang transparan"
				subtitle="Tiga pilar utama platform IKM."
			/>,
		);
		expect(screen.getByText("Layanan Kami")).toBeInTheDocument();
		expect(screen.getByText(/Sistem penilaian/)).toBeInTheDocument();
		expect(screen.getByText("yang transparan")).toBeInTheDocument();
		expect(
			screen.getByText("Tiga pilar utama platform IKM."),
		).toBeInTheDocument();
	});

	it("renders without optional subtitle and accent", () => {
		render(<SectionHeader kicker="Panduan" title="Tiga langkah" />);
		expect(screen.getByText("Panduan")).toBeInTheDocument();
		expect(screen.getByText("Tiga langkah")).toBeInTheDocument();
	});
});
