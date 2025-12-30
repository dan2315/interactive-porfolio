import { genericGet, genericPost, adminFetch } from "./httpClient";

const projectsService = {
  public: {
    getAll: () => genericGet("projects"),
    toggleReaction: (slug, emoji) => genericPost(`projects/${slug}/reaction`, emoji),
  },

  admin: {
    create: async (project) =>  await adminFetch("admin/projects").post(JSON.stringify(project)),
    update: async (id, patch) => await adminFetch(`admin/projects/${id}`).patch(JSON.stringify(patch)),
    togglePublish: async (id) => await adminFetch(`admin/projects/${id}/publish`).patch(),
    delete: async (id) => await adminFetch(`admin/projects/${id}`).delete()
  },
};

export default projectsService;
