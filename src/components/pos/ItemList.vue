<template>
  <div ref="test" class="item-list-section">
    <v-row class="mb-2">
      <v-col cols="3" sm="4" class="font-weight-bold">Producto</v-col>
      <v-col cols="3" sm="2" class="text-center font-weight-bold">Cantidad</v-col>
      <v-col cols="3" sm="2" class="text-right font-weight-bold">P. Unit</v-col>
      <v-col cols="2" sm="2" class="text-right font-weight-bold">Total</v-col>
      <v-col cols="1" sm="1" class="text-center font-weight-bold"></v-col>
    </v-row>

    <div
    id="itemsListContainer"
    style="height: 63vh; overflow: auto; overflow-x: hidden"
  >
    <div
      class="item-list-item"
      v-for="(item, index) in cartItems"
      v-bind:key="index"
    >
      <item-list-item
        @clicked="openDialog($event)"
        :item="item"
        :index="index"
      ></item-list-item>
    </div>
    <v-row class="border-separator"></v-row>
  </div>

    <!-- edit quantity modal -->
    <v-dialog
      class="edit-qty-modal"
      v-if="posCartPreviewItem"
      v-model="editCartItemDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title>Editar cantidad</v-card-title>
        <v-card-text class="pb-0">
          <v-col cols="12" class="px-0">
            <h3 class="item-name pb-4">{{ posCartPreviewItem.name }}</h3>
            <v-text-field
              type="number"
              min="0"
              label="Cantidad"
              color="secondary"
              autofocus:rules="quantityRules"
              @keypress.enter="modifyQuantity"
              @change="modifyQuantity"
              v-model="itemQuantity"
            ></v-text-field>
            <v-switch
              v-model="posCartPreviewItem.isWholesale"
              :label="'Precio por ' + (posCartPreviewItem.isWholesale ? 'mayoreo' : 'menudeo')"
              class="mb-4"
              @change="updatePrice(posCartPreviewItem)"
            ></v-switch>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="editCartItemDialog = false"
            >Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit quantity modal -->
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';
import ItemListItem from './ItemListItem.vue';

export default {
  name: 'item-list',

  components: {
    ItemListItem,
  },
  
  computed: {
  ...mapGetters(['cartItems', 'posCartPreviewItem']),
  currentPrice: {
    get() {
      if (this.posCartPreviewItem) {
        return this.isWholesale
          ? this.posCartPreviewItem.wholesale_price
          : this.posCartPreviewItem.retail_price;
      }
      return 0;
    },
    set(newPrice) {
      this.itemPrice = newPrice;
      this.modifyQuantity();
    },
  },
},


  data: () => ({
    editCartItemDialog: false,

    // edit cart item vars
    itemQuantity: 0,
    itemPrice: 0,
    isWholesale: false,
  }),

  watch: {
    isWholesale(newValue) {
      console.log('Entro primero');
      this.updatePrice(newValue);
    },
  },
  methods: {
    updatePrice(isWholesale) {
      console.log('Entro tercero');
      if (this.posCartPreviewItem) {
        this.itemPrice = isWholesale
          ? this.posCartPreviewItem.wholesale_price
          : this.posCartPreviewItem.retail_price;

        this.posCartPreviewItem.sale_type = isWholesale ? 1 : 0;
        this.modifyQuantity();
      }
    },

    openDialog(data) {
      this.itemQuantity = data.quantity;
      this.editCartItemDialog = true;
    },
    modifyQuantity() {
    if (!this.posCartPreviewItem) {
      return;
    }
    

    if (this.itemQuantity <= 0) {
      this.itemQuantity = 1;
    }
    const payload = {
      productId: this.posCartPreviewItem.id,
      newQuantity: this.itemQuantity,
      newPrice: this.posCartPreviewItem.isWholesale
          ? this.posCartPreviewItem.wholesale_price
          : this.posCartPreviewItem.retail_price,
      sale_type: this.posCartPreviewItem.sale_type,
      };

    this.$store.dispatch('updateQuantityInCart', payload);
    this.editCartItemDialog = false;
  },
  },

  mounted() {
  },
};
</script>

<style lang="less" scoped>
.item-list-title {
  padding: 0;
  font-size: 1.4rem;
}

.item-name {
  font-weight: 400;
  font-size: 1.1rem;
}
</style>
