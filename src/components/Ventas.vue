<template>
    <v-container class="no-padding global-container" fluid>
        <v-row>
            <pos-header></pos-header>
        </v-row>
        <v-row>
            <v-col cols="4" lg="3">
                <h2 v-if="!itemsListCount" class="total-items-label font-weight-bold">
                    El carrito esta vacio
                </h2>
                <h2 v-else class="total-items-label">
                    Artículos del carro: <b>{{ itemsListCount }}</b>
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <!-- Columna para el item-list -->
            <v-col cols="12" md="12" class="pa-0">
                <item-list ref="itemlist"></item-list>
            </v-col>
            <!-- Columna para el payment (colocada al lado del item-list) -->
            <v-col cols="12" md="12">
                <payment></payment>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
/* eslint-disable */ 
import PosHeader from '@/components/pos/PosHeader.vue';
import ItemList from './pos/ItemList.vue';
import Payment from './pos/Payment.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'pos-vista',
    data() {
        return {
        }
    },
    components: {
        PosHeader,
        ItemList,
        Payment,
  },
  computed: {
    ...mapGetters({
      itemsListCount: 'posCartItemsLength',
    }),
  },

    async mounted() {
    },
    created() {
    },
    destroyed() {
    },
};
</script>

<style scoped>
.global-container {
    padding: 0 !important;
    padding-left: 3rem !important;
    padding-right: 3rem !important;
    padding-top: 2rem !important;
}

.total-items-label {
    color: black;
    font-size: 1.2rem;
    font-weight: 400;
}

.saved-quotations-ac {
    height: 36px;
}
</style>
