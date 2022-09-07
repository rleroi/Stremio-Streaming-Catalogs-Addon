import axios from 'axios'
import { createApp } from 'vue'

import './style.css'
import App from './App.vue'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createApp(App).mount('#app')
