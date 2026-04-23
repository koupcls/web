
import { createApp } from "vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from "./router"
import '@/assets/styles/main.css'

const app = createApp(App)

app.use(router)

app.use(createPinia())
app.use(Toast, {
  position: POSITION.BOTTOM_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  align: 'center'
})

app.mount('#app')