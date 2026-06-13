import type { Metadata } from "next";
import ProjectsComingSoon from "./ProjectsPage";


// import { NO_INDEX_PAGE } from '../../constants/seo.constants'

export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace page",
  // ...NO_INDEX_PAGE
};

export default function WorkspacePage() {
  return <ProjectsComingSoon />;
}
