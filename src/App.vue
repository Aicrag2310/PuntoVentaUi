<template>
    <v-app style="background-color: #f5f5f5;">
  <AppNavigation v-if="!['login'].includes($route.name)"></AppNavigation>
  <v-main>
    <router-view />
    <router-link to="/dashboard"></router-link>
  </v-main>
</v-app>
</template>

<script>
/* eslint-disable */
import { TokenUtils } from '@/utils/TokenUtils';
import AppNavigation from './components/AppNavigation.vue';
import * as AppUtils from '@/utils/AppUtils';

export default {
  name: 'App',
  components: {
    AppNavigation,
  },
  data: () => ({}),
  async mounted() {
    if (TokenUtils.hasToken()) {
      const payload = TokenUtils.getJwtData();
      const { identity: userId } = payload;
      if (window.location.pathname === '/') {
        AppUtils.redirectToUserSectionByAttributes(this.$router);
      }
    } else {
      this.$router.push('/login');
    }
  },
  watch: {
    // Observa los cambios en la ruta
    '$route.path'(newRoute) {
      console.log('Ruta actual: ', newRoute);
    }
  }

}
</script>

<style lang="less">

.title-text {
  font-size: 2rem;
  font-weight: 300;
  color: #0d1d4e;
}

.subtitle-text {
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 0 !important;
}

.swal2-popup {
  font-family: 'Roboto', sans-serif !important;
}

.center{
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.w-full{
  width: 100%;
}
.h-full{
  height: 100%;
}
.gap-2{
  gap: 0.5rem;
}
.flex-nowrap{
  flex-wrap: nowrap;
}
</style>