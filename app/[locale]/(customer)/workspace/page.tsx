import type { Metadata } from "next";
import ProjectsComingSoon from "./ProjectsPage";




export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace page",

};

export default function WorkspacePage() {
  return <ProjectsComingSoon />;
}
