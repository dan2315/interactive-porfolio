import { genericGet, genericPost } from "./httpClient"

const projectsService = {}

projectsService.getAllProjects = async () => genericGet('projects');
projectsService.toggleReaction = async (slug, emoji) => genericPost(`projects/${slug}/reaction`, emoji);

export default projectsService;