/* eslint-disable */
import Vue from 'vue';
import Snotify, { SnotifyPosition } from 'vue-snotify';

// import 'vue-snotify/styles/material.css';

const options = {
  toast: {
    position: SnotifyPosition.rightBottom,
    showProgressBar: false,
  },
};

Vue.use(Snotify, options);
