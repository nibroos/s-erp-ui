import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import DateIODateFnsAdapter from '@date-io/date-fns'
import { VFileUpload, VFileUploadItem } from 'vuetify/labs/VFileUpload'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { vuetifyProTipTap } from './tipTapProPlugin'

const dateFns = new DateIODateFnsAdapter()

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VFileUpload,
      VFileUploadItem,
      VCalendar
    },
    date: {
      adapter: dateFns
    }
  })
  app.vueApp.use(vuetify)
})
