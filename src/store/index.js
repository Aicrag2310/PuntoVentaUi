
/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "../services/Axios";

Vue.use(Vuex)
export const types = {
  UPDATE_POS_CART_PREVIEW_ITEM: 'UPDATE_POS_CART_PREVIEW_ITEM',
  UPDATE_ITEM_QUANTITY: 'UPDATE_ITEM_QUANTITY',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  SET_CART_API_RESPONSE: 'SET_CART_API_RESPONSE',
};

export default new Vuex.Store({
  state: {
    cart: [],
    posCartPreviewItem: null,
    cartApiResponse: null,
  },
  getters: {
    posCartItemsLength: state => state.cart.length,
    cartItems: state => state.cart,
    totalPrice: (state) =>
      state.cart.reduce((total, item) => total + item.calculated_price * item.quantity, 0),
    posCartPreviewItemId: (state) => (id) => {
      return state.cart.find(item => item.id === id);
    },
    posCartPreviewItem: state => state.posCartPreviewItem,
    posCartTotal: state => state.cart.reduce((acc, item) => acc + item.calculated_price * item.quantity, 0),
  },
  mutations: {
    [types.UPDATE_POS_CART_PREVIEW_ITEM](state, payload) {
      state.posCartPreviewItem = payload;
    },
    [types.UPDATE_ITEM_QUANTITY](state, payload) {
      const product = state.cart.find((item) => item.id === payload.productId);
      if (product) {
        product.quantity = payload.newQuantity;
        product.calculated_price = payload.newPrice;
        product.sale_type = payload.sale_type;
      }
    },
    ADD_TO_CART(state, product) {
      const existingProduct = state.cart.find((p) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        const calculatedPrice = product.sale_type === 'wholesale' ? product.wholesale_price : product.retail_price;
        state.cart.push({ ...product, quantity: product.quantity || 1, calculated_price: calculatedPrice, sale_type: product.sale_type || 0});
      }
    },
    [types.REMOVE_FROM_CART](state, productId) {
      state.cart = state.cart.filter((p) => p.id !== productId);
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
    SET_CART_API_RESPONSE(state, response) {
      state.cartApiResponse = response;
    },
    SET_POS_CART_PREVIEW_ITEM(state, item) {
      state.posCartPreviewItemId = item.id;
    },
  },
  actions: {
    updateQuantityInCart({ commit }, payload) {
      commit(types.UPDATE_ITEM_QUANTITY, payload);
    },
    setPosCartPreviewItem({ commit }, payload) {
      commit(types.UPDATE_POS_CART_PREVIEW_ITEM, payload);
    },
    addToCart({ commit }, product) {
      if (product.quantity > 0) {
        commit('ADD_TO_CART', product);
      } else {
        console.error('La cantidad debe ser mayor que cero.');
      }
    },
    removeFromCart({ commit }, productId) {
      commit(types.REMOVE_FROM_CART, productId);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
    async sendCartToApi({ state, commit }) {
      try {
        const cartToSend = state.cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          sale_type: item.sale_type, // Asumo que tienes un campo `sale_type` para menudeo o mayoreo
          total: item.calculated_price * item.quantity  // Usamos el precio calculado
        }));
        
        const response = await Axios.post('/api/cart', cartToSend);
        commit(types.SET_CART_API_RESPONSE, response.data);
      } catch (error) {
        console.error('Error al enviar el carrito al API:', error);
      }
    },
  },
  modules: {
  }
})
