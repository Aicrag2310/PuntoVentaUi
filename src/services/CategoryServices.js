/* eslint-disable */
import Axios, { setAuthHeaders } from '@/services/Axios';
import { ProductTableItem } from '@/common/models/ProductTableItem';

const resource = '/categories';

export default {
    async getCategoryAutocomplete(){
        const headers = setAuthHeaders({});
        const { data } = await Axios.get(`${resource}/autocomplete`, {
            headers,
          });
        return data.data
    },
};