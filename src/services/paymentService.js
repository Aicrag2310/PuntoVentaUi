/* eslint-disable */
import Axios, { setAuthHeaders } from '@/services/Axios';
const resource = '/sales';

export default {
  async sendCartToApi(cart) {
    const headers = setAuthHeaders({});
    try {
      const response = await Axios.post(`${resource}`, cart, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al enviar el carrito al API:', error);
      throw error;
    }
  },
};