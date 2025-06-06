import './index.css'

import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import App from './App.vue'

inject()

const app = createApp(App)

app.mount('#app')
