import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import DateIODateFnsAdapter from '@date-io/date-fns'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const dateFns = new DateIODateFnsAdapter()

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VFileUpload,
    },
    date: {
      adapter: dateFns
    }
  })
  app.vueApp.use(vuetify)
})
