<template>
    <v-container>
        <ventas-card></ventas-card>
    </v-container>
</template>

<script>
/* eslint-disable */
import VentasCard from '@/components/Ventas.vue';

export default {
    name: 'ventas-view',
    components: {
        VentasCard,
    },
};
</script>