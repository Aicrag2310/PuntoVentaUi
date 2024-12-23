<template>
  <div>
    <v-row class="d-flex center justify-space-between mx-2 mt-3">
      <h1 class="title-text">Productos</h1>
      <div class="d-flex center gap-2">
        <v-text-field v-model="filterQuery" @keypress.enter="onSearch" outlined append-icon="mdi-magnify" single-line
          label="Buscando productos" color="secondary" hide-details dense
          @click:clear="
            filterQuery = '';
            onSearch();
          "
          @change="onSearch">
        </v-text-field>
        <v-btn to="/new-product" color="primary" dark>
          <v-icon>mdi-plus</v-icon>
          Nuevo Producto
        </v-btn>
      </div>
    </v-row>

    <v-row>
      <v-col cols="12" sm="12">
        <v-data-table :items="items" :loading="isTableLoading" :server-items-length="itemsCount" :headers="headers"
          :page.sync="tablePage" :footer-props="{ itemsPerPageOptions: [5, 10, 15, 20, 100] }"
          :items-per-page.sync="tableLimit" @update:page="onUpdate" @update:items-per-page="onUpdate"
          no-data-text="Productos no encontrados.">
          <template v-slot:[`item.action`]="{ item }">
            <div class="center gap-2">
              <v-btn @click="editItem(item)" color="green" dark>
                <v-icon small> mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="removeProduct(item)" dark color="red">
                <v-icon small> mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </div>
</template>
<script>
/* eslint-disable */
import ProductService from '@/services/ProductService';
import { TokenUtils } from '@/utils/TokenUtils';
import * as AppUtils from '@/utils/AppUtils';
import Swal from 'sweetalert2';

export default {
  name: 'product-card',
  data() {
    return {
      filterQuery: '',
      items: [],
      itemsCount: -1,
      isTableLoading: true,
      tablePage: 1,
      tableLimit: 5,
      headers: [
        {
          text: 'Id',
          value: 'id',
          align: 'center',
        },
        {
          text: 'Nombre',
          value: 'name',
          align: 'center',
        },
        {
          text: 'Descripción',
          value: 'description',
          align: 'center',
        },
        {
          text: 'Categoria',
          value: 'category',
          align: 'center',
        },
        {
          text: 'Precios De Compra',
          value: 'purchase_price',
          align: 'center',
        },
        {
          text: 'Precios De Menudeo',
          value: 'retail_price',
          align: 'center',
        },
        {
          text: 'Precios De Mayoreo',
          value: 'wholesale_price',
          align: 'center',
        },
        {
          text: '',
          value: 'action',
          align: 'center',
        },
      ],
    };
  },
  methods: {
    beforeRouteUpdate(to, from, next) {
      try {
        const { filterQuery } = to.query;
        this.filterQuery = filterQuery ?? ''; // Actualizar el valor de filterQuery con el nuevo valor de la URL
        this.page = 1;
        this.loadTableData(true);
      } catch (error) {
        console.error(error);
      }
      next();
    },
    editItem(item) {
      this.$router.push(`/${item.id}/edit-product`);
    },
    onUpdate() {
      this.loadTableData(false);
    },
    onSearch() {
  const currentQuery = this.$route.query.filterQuery || '';
  if (this.filterQuery === currentQuery) {
    this.loadTableData(true); // Recargar datos sin navegar
  } else {
    this.$router.push(`/dashboard?filterQuery=${this.filterQuery}`);
  }
},

    loadTableData(reset = false) {
      if (reset) {
        this.items = [];
        this.isTableLoading = true;
        this.itemsCount = -1;
      }

      const limit = this.tableLimit;
      const offset = limit * (this.tablePage - 1);

      this.getTableData(limit, offset, this.filterQuery)
        .catch(error => console.error('Error', error))
        .then(() => (this.isTableLoading = false));
    },
    async getTableData(limit, offset, query) {
      this.isTableLoading = true;

      if (this.itemsCount === -1) {
        this.itemsCount = await ProductService.getProductTableCount(query);
      }

      this.items = await ProductService.getProductTableData(
        limit,
        offset,
        query,
      );
    },
  },
  async mounted() {
    const { filterQuery } = this.$route.query;
    this.filterQuery = filterQuery ?? '';
    await this.loadTableData(true);
  },
};
</script>
