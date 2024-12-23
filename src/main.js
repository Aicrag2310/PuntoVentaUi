/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import './global.css';
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/currency';
import './plugins/sweetalert';
import './plugins/snotify';
import './plugins/barcode-scanner';
import './plugins/currency-field';

Vue.config.productionTip = false


Vue.filter('toCurrency', (value) => {
  if (typeof value !== 'number') {
    return value;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
  });
  return formatter.format(value);
});

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
