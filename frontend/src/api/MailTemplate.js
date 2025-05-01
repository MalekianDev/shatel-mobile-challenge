import api from "./index";

export const getMailTemplates = async () => {
    try {
        return await api.get('v1/notifications/mail/template/')
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const createMailTemplate = async (mailTemplate) => {
    try {
        return await api.post('v1/notifications/mail/template/', mailTemplate)
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

