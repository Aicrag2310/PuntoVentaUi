<template>
<v-container>
    <products-table></products-table>
</v-container>
</template>

<script>
/* eslint-disable */
import ProductsTable from '@/components/ProductsTable.vue';

export default {
    name: 'dashboard',
    components: {
    ProductsTable,
    },
};
</script>
