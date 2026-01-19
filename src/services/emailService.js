import { adminFetch, genericPost } from "./httpClient";

export const emailService = {
    public: {
        sendMessage: async (email) => genericPost(`contact/messages`, email)
    },

    admin: {
        create: async () =>  await adminFetch("admin/contact/messages").get()
    }
}
