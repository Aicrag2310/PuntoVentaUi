<template>
  <v-row :class="{ active: item.id === posCartPreviewItemId }" @click.stop="previewItemInfo(item)"
    class="item-list-item" @dblclick.stop="emitDblClick(item)">
    <v-col cols="12" sm="1">
      <div>{{ item.id }}</div>
    </v-col>
    <v-col cols="12" sm="4">
      <div>{{ item.name }}</div>
    </v-col>
    <v-col cols="12" sm="2">
      <div>{{ item.quantity }}</div>
    </v-col>
    <v-col class="text-right" cols="12" sm="2">
      <div>{{ item.calculated_price }}</div>
    </v-col>
    <v-col class="text-right" cols="12" sm="2">
      <div>{{ (item.calculated_price * item.quantity).toFixed(2) }}</div>
    </v-col>
    <!-- Botón para eliminar el producto -->
    <v-col cols="12" sm="1">
      <v-btn @click.stop="removeItemFromCart(item.id)" icon style="margin-top: -5px; " color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'item-list-item',
  props: ['item', 'index'],

  computed: {
    ...mapGetters(['posCartPreviewItemId']),
  },

  methods: {
    ...mapActions([
      'setPosCartPreviewItem',
      'removeFromCart',
    ]),
    previewItemInfo(item) {
      // Lógica para mostrar información del item
    },

    emitDblClick(item) {
      this.$emit('clicked', item);
    },
    removeItemFromCart(productId) {
      this.removeFromCart(productId);
    },
    emitDblClick(item) {
      this.setPosCartPreviewItem(item);
      this.$emit('clicked', item);
    },
  },
};
</script>

<style lang="less" scoped>
.item-list-item {
  border-bottom: 1px solid black;
  padding: 0;
  padding-top: 0.8rem;

  &:hover {
    cursor: pointer;
    background-color: #f0f0f0;
  }

  p.title {
    font-size: 1rem !important;
    font-weight: 400;
    margin: 0;
  }
}

.active {
  background-color: #f0f0f0;
}

.fitext {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    overflow: auto;
    white-space: normal;
  }
}
</style>
