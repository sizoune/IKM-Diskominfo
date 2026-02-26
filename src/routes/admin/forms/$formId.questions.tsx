import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/forms/$formId/questions")({
	component: QuestionsLayout,
});

function QuestionsLayout() {
	return <Outlet />;
}
