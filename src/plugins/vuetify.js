import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#517cfd',
        lightPrimary: '#ff9ccd',
        secondary: '#504152',
        accent: '#ffdd00',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        backgroundColor: '#f5f5f5'
      }
    }
  }
})
