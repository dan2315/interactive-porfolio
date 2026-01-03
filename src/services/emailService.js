import { genericPost } from "./httpClient";

export const emailService = {
    sendEmail: async (email) => genericPost(`contact/email`, email)
}
