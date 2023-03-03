import axios from 'axios'
import { createApp } from 'vue'
import Popper from 'vue3-popper'

import './style.css'
import App from './App.vue'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

createApp(App)
    .component("Popper", Popper)
    .mount('#app');
