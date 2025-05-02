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

export const MAIL_BULK_STATUS = {
    CANCEL: 1,
    RESUME: 2,
    PAUSE: 4
};

export const updateMailBulkStatus = async (id, status) => {
    try {
        return await api.patch(`v1/notifications/mail/bulk/${id}/`, {'status': status})
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMailBulkDetail = async (id) => {
    try {
        return await api.get(`v1/notifications/mail/bulk/${id}/detail/`)
    } catch (error) {
        throw error.response?.data || error.message;
    }
};