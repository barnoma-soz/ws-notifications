import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import 'toastify-js/src/toastify.css'

//TODO: Можно вывести в отдельный файл
axios.defaults.baseURL = 'https://charmium.ru';

createApp(App).mount('#app')
