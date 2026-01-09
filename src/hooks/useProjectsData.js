import { useQuery } from "@tanstack/react-query";
import projectsService from "../services/projectsService";

const STALE_30_MIN = 1000 * 60 * 30;

const projectsQuery = {
  queryKey: ["projects"],
  queryFn: projectsService.public.getAll,
  staleTime: STALE_30_MIN,
};

async function prefetchProjects(queryClient) {
  await queryClient.prefetchQuery(projectsQuery);
}

function useProjectsData() {
  const projects = useQuery(projectsQuery);
  return projects;
}

export default useProjectsData;
export { prefetchProjects, projectsQuery };
