/* eslint-disable */
import Axios, { setAuthHeaders } from '@/services/Axios';
import { ProductTableItem } from '@/common/models/ProductTableItem';

const resource = '/product';

export default {
    async getProductAutocomplete(){
        const headers = setAuthHeaders({});
        const { data } = await Axios.get(`${resource}/autocomplete`, {
            headers,
          });
        return data
    },
    async getProductTableData(limit, offset, query){
        const params = {
            limit,
            offset,
            query,
        };

        const headers = setAuthHeaders({});
        const { data } = await Axios.get(`${resource}/table/data`, {
            params,
            headers,
          });
          return data.map(item => new ProductTableItem(item));
    },

    async getProductTableCount(query){
        const params = {
            query,
          };
          
        const headers = setAuthHeaders({});

        const { data } = await Axios.get(`${resource}/table/count`, {
            params,
            headers,
        });
        return data.count;
    },

    async getProductById(productId) {
        try {
            const headers = setAuthHeaders({
                'Accept-Language': 'es',
            });
            const { data } = await Axios.get(`/product/${productId}`, {
                headers,
            });
            return data[0];
        } catch (error) {
            console.error('Error al obtener el producto:', error.response?.data || error.message);
            throw error;
        }
    },

    async createProduct(name,
        description,
        categoryId,
        baseCost,
        baseMenu,
        baseMayo,
        stock,
        stockMin,
        stockMax)
        {
        const payload = new FormData();

        if (name){
            payload.append('name', name);
        }
        if (description){
            payload.append('description', description);
        }
        if (baseMayo){
            payload.append('purchase_price', baseMayo);
        }
        if (baseCost){
            payload.append('retail_price', baseCost);
        }
        if (baseMenu){
            payload.append('wholesale_price', baseMenu);
        }
        if (stock){
            payload.append('stock', stock);
        }
        if (stockMin){
            payload.append('min_stock', stockMin);
        }
        if (categoryId){
            payload.append('category', categoryId);
        }

        const headers = setAuthHeaders({});
        const { data } = await Axios.post(`${resource}`, payload, {
            headers,
        });
        
        return data;
    },

    async updtedProduct(productId,
        name,
        description,
        categoryId,
        baseCost,
        baseMenu,
        baseMayo,
        stock,
        stockMin,
        stockMax)
        {
        const payload = new FormData();

        if (name){
            payload.append('name', name);
        }
        if (description){
            payload.append('description', description);
        }
        if (baseMayo){
            payload.append('wholesale_price', baseMayo);
        }
        if (baseCost){
            payload.append('purchase_price', baseCost);
        }
        if (baseMenu){
            payload.append('retail_price', baseMenu);
        }
        if (stock){
            payload.append('stock', stock);
        }
        if (stockMin){
            payload.append('min_stock', stockMin);
        }
        if (categoryId){
            payload.append('category', categoryId);
        }

        const headers = setAuthHeaders({});
        const { data } = await Axios.put(`${resource}/${productId}`, payload, {
            headers,
        });
        
        return data;
    },
};