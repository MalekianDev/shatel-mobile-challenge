import api from "./index";

export const signup = async (userData) => {
  try {
    const response = await api.post(`v1/accounts/user/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};