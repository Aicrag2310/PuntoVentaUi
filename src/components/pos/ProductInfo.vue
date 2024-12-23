<template>
  <v-col v-if="posCartPreviewItem" cols="12" md="12" align-self="center">
    <v-col cols="12" sm="12" class="pa-0">
      <h2 v-resize-text="{minFontSize: '1px', maxFontSize: '20px'}"
        class="text-center">{{ posCartPreviewItem.name }}</h2>
      <h4 class="text-center font-weight-medium primary--text my-2">
        {{ posCartPreviewItem.measuringUnitName }}
      </h4>
    </v-col>
    <v-img :src="posCartPreviewItem.imageUrl" alt="" contain height="250"></v-img>
  </v-col>
</template>

<script>
/* eslint-disable */ 
import { mapGetters } from 'vuex';

export default {
  name: 'product-info',
  computed: {
    ...mapGetters([
      'posCartPreviewItem',
    ]),
  },
  methods: {
    textChanged() {
    },
  },
};
</script>
<style>
.text-center {
    color: black;
}
</style>
