/* eslint-disable */
import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2, {
  customClass: {
    container: 'ens-sweetalert-dialog',
    confirmButton: 'ens-sad-confirm-btn',
  },
});
