import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { validateConfig } from './config'

import './style.css'

// Validate configuration before starting the app
validateConfig()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')