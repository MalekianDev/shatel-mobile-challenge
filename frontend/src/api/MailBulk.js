import api from "./index";


export const createMailBulk = async (mailBulk) => {
    try {
        return await api.post('v1/notifications/mail/bulk/', mailBulk, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
