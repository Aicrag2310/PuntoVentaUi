<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" sm="6">
        <v-autocomplete
          :key="autocompleteKey"
          ref="searchProductInput"
          outlined
          hide-details
          label="Buscador de productos."
          color="secondary"
          no-data-text="Producto no encontrado"
          v-model="selectedProduct"
          :items="productsList"
          item-text="name"
          item-value="id"
          :search-input.sync="query"
          @update:search-input="filterProducts"
          @change="addItemToList"
          return-object
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
/* eslint-disable */ 

import ProductService from '@/services/ProductService';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'pos-header',
  data() {
    return {
      selectedProduct: null,
      query: '',
      allProducts: [], // Lista completa de productos cargada inicialmente
      productsList: [],
      autocompleteKey: 0,
    };
  },

  computed: {
    ...mapGetters(['cartItems', 'totalPrice']),
  },

  methods: {

    async addItemToList() {
      if (this.selectedProduct) {
        const existingProduct = this.cartItems.find(
          (item) => item.id === this.selectedProduct.id
        );
        if (existingProduct) {
          this.addToCart({
          ...existingProduct,
          quantity: 1,
        });
        } else {
          this.addToCart({
            ...this.selectedProduct,
            quantity: 1, // Default quantity
          });
        }
        this.selectedProduct = null; // Resetea el valor seleccionado
        this.query = '';
        this.autocompleteKey += 1;
      }
    },

    ...mapActions(['addToCart', 'removeFromCart']),
    onAddToCart() {
      if (this.selectedProduct) {
        this.addToCart({
          ...this.selectedProduct,
          quantity: 1, // Default quantity
        });
        this.selectedProduct = null; // Reset input
      }
    },

    filterProducts(query) {
      if (!query) {
        this.productsList = this.allProducts; // Si no hay búsqueda, muestra todos
        return;
      }

      const lowerCaseQuery = query.toLowerCase();
      this.productsList = this.allProducts.filter(product =>
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    },
  },

  async mounted() {
    try {
      // Carga inicial de todos los productos
      this.allProducts = await ProductService.getProductAutocomplete();
      this.productsList = this.allProducts;
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  },
};
</script>
