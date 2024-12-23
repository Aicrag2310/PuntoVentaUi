<template>
    <v-container>
        <v-row class="mb-2">
            <v-col cols="12" sm="12">
                <div class="center justify-space-between">
                    <v-btn color="red" dark class="ens-cobsd-close-btn mr-2" @click="goBack">
                        Regresar
                    </v-btn>
                    <h1 class="title-text">{{ title }}</h1>
                </div>
            </v-col>
        </v-row>
        <v-expansion-panels :value="expansionPanelsValue" multiple>
            <v-expansion-panel value="0" class="mb-4">
                <v-expansion-panel-header>
                    <p class="subtitle-text">
                        <v-icon color="secondary">mdi-tag</v-icon>
                        Información General
                    </p>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form ref="upperForm">
                        <v-row>
                            <v-col cols="12" sm="8">
                                <v-text-field :rules="requiredRules" v-model="name" :disabled="disabled"
                                    color="secondary" outlined label="Nombre *" counter="250"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="description" :disabled="disabled" color="secondary" outlined
                                    label="Descripción *" counter="250"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-row no-gutters>
                                    <v-text-field v-model="barCode" :disabled="disabled" color="secondary" outlined
                                        label="Código de barras" append-icon="mdi-barcode" counter="100"
                                        @click:append="showBarcodeReader = true"></v-text-field>
                                    <v-dialog v-model="showBarcodeReader" width="500">
                                        <v-card>
                                            <v-card-title class="text-h5 grey lighten-2">
                                                Barcode Reader
                                            </v-card-title>

                                            <v-card-text>
                                                <StreamBarcodeReader v-if="showBarcodeReader" ref="barcodeReader"
                                                    @decode="onDecode">
                                                </StreamBarcodeReader>
                                            </v-card-text>
                                        </v-card>
                                    </v-dialog>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-autocomplete v-model="categoryId" :disabled="disabled" :items="category" item-text="description"
                                    item-value="id" :loading="isCategoryLoading" color="secondary" outlined
                                    label="Categoria" @contextmenu.prevent></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-currency-field outlined v-model="baseCost" color="secondary" label="Precio de compra">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="green"> mdi-currency-usd</v-icon>
                                    </template>
                                </v-currency-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-currency-field outlined v-model="baseMenu" color="secondary" label="Precio Menudeo">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="green"> mdi-currency-usd</v-icon>
                                    </template>
                                </v-currency-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-currency-field outlined v-model="baseMayo" color="secondary" label="Precio Mayoreo">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="green"> mdi-currency-usd</v-icon>
                                    </template>
                                </v-currency-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="stock"
                                    label="Cantidad"
                                    outlined
                                    append-icon="mdi-numeric-1-box-outline"
                                    color="secondary"
                                    ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="stockMin"
                                    label="Cantidad Minima"
                                    outlined
                                    append-icon="mdi-numeric-1-box-outline"
                                    color="secondary"
                                    ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                    v-model="stockMax"
                                    label="Cantidad Maxima"
                                    outlined
                                    append-icon="mdi-numeric-1-box-outline"
                                    color="secondary"
                                    ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div>
      <v-row justify="end" class="mt-6" v-if="editProduct">
        <v-btn
          @click="updateProduct()"
          color="secondary"
          fixed
          fab
          large
          bottom
          right
          class="fixed right center fab--no-radius"
        >
          <v-icon class="">mdi-content-save</v-icon>
        </v-btn>
      </v-row>
      <v-row justify="end" class="mt-6" v-else>
        <v-btn
          @click="addProduct()"
          color="blue"
          dark
          fixed
          fab
          large
          bottom
          right
          class="fixed right center fab--no-radius"
        >
          <v-icon class="" color="">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </div>
    </v-container>
</template>

<script>
/* eslint-disable */
import Swal from 'sweetalert2';
import { StreamBarcodeReader } from 'vue-barcode-reader';
import CategoryServices from '@/services/CategoryServices';
import ProductService from '@/services/ProductService';

export default {
    name: 'edit-product-form',
    components: {
        StreamBarcodeReader,
    },
    props: {
        title: String,
        editProduct: Boolean || null,
        createProduct: Boolean || null,
    },

    data: () => ({
        tableLimit: 50,
        routeProductId: null,
        disabled: false,
        requiredRules: [v => !!v || 'Este campo es obligatorio'],
        name: '' || null,
        description: null,
        expansionPanelsValue: [0, 1, 2, 3, 4, 5],
        barCode: null,
        showBarcodeReader: false,
        isCategoryLoading: true,
        category: [],
        categoryId: '',
        stock: null,
        stockMin: null,
        stockMax: null,
        baseCost: null,
        baseMenu: null,
        baseMayo: null
        
    }),
    async mounted() {
        this.category = await CategoryServices.getCategoryAutocomplete();
        this.isCategoryLoading = false;
        this.routeProductId = Number(this.$route.params.id ?? 0);
        await this.setUpPage(this.routeProductId, true);
    },
    methods: {
        async setUpPage(productId, reload) {
            if (!this.editProduct) {
                return;
            }
            const resp = await ProductService.getProductById(productId);
            this.name = resp.name;
            this.description = resp.description;
            this.categoryId = resp.categoryId;
            this.baseCost = resp.purchase_price;
            this.baseMenu = resp.retail_price;
            this.baseMayo = resp.wholesale_price;
            this.stock = resp.stock;
            this.stockMin = resp.min_stock;
            this.stockMax = resp.max_stock;
        },
        goBack() {
            window.history.back();
        },
        onDecode(result) {
            this.barCode = result;
            this.showBarcodeReader = false;
        },
        async updateProduct() {
            try {
                const resp = await ProductService.updtedProduct(this.routeProductId, this.name, this.description, this.categoryId, this.baseCost, this.baseMenu, this.baseMayo, this.stock, this.stockMin, this.stockMax);
                Swal.fire({
                    icon: 'success',
                    title: 'Correcto',
                    text: 'Datos actualizados correctamente.',
                    timer: 1000, // Cierra la alerta automáticamente después de 2 segundos (2000ms)
                    showConfirmButton: false // Elimina el botón de confirmación
                });
                this.goBack()
            } catch (error) {
                
            }
        },
        async addProduct() {
            if (!this.name) {
                return Swal.fire('Error', 'El nombre del producto es obligatorio.', 'error');
            }
            if (!this.description) {
                return Swal.fire('Error', 'La descripción del producto es obligatoria.', 'error');
            }
            if (!this.categoryId) {
                return Swal.fire('Error', 'La categoría es obligatoria.', 'error');
            }
            if (!this.baseCost || this.baseCost <= 0) {
                return Swal.fire('Error', 'El precio de compra debe ser mayor a 0.', 'error');
            }
            if (!this.baseMenu || this.baseMenu <= 0) {
                return Swal.fire('Error', 'El precio de menú debe ser mayor a 0.', 'error');
            }
            if (!this.baseMayo || this.baseMayo <= 0) {
                return Swal.fire('Error', 'El precio al mayoreo debe ser mayor a 0.', 'error');
            }
            if (!this.stock || this.stock <= 0) {
                return Swal.fire('Error', 'El stock inicial debe ser mayor a 0.', 'error');
            }
            if (!this.stockMin || this.stockMin <= 0) {
                return Swal.fire('Error', 'El stock mínimo debe ser mayor a 0.', 'error');
            }
            if (!this.stockMax || this.stockMax <= 0) {
                return Swal.fire('Error', 'El stock máximo debe ser mayor a 0.', 'error');
            }
            if (this.stockMin > this.stockMax) {
                return Swal.fire('Error', 'El stock mínimo no puede ser mayor al stock máximo.', 'error');
            }
            try {
                const resp = await ProductService.createProduct(this.name, this.description, this.categoryId, this.baseCost, this.baseMenu, this.baseMayo, this.stock, this.stockMin, this.stockMax);
                Swal.fire({
                    icon: 'success',
                    title: 'Correcto',
                    text: 'Producto creado correctamente.',
                    timer: 1000, // Cierra la alerta automáticamente después de 2 segundos (2000ms)
                    showConfirmButton: false // Elimina el botón de confirmación
                });
                this.goBack()
            } catch (error) {
                
            }
        },
    }
};
</script>

<style>
.fab--no-radius {
    border-radius: 8px !important;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>