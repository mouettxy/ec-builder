// register vue composition api globally
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import './styles/main.css'
import 'virtual:windi-utilities.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.PROD ? '/ec-builder/' : '/'),
  routes,
})

router.beforeEach((to) => {
  document.title = to.meta.header as string
})

app.use(router)
app.mount('#app')
