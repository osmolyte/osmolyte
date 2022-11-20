import { createApp } from 'vue'
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './style.css'
import App from './App.vue'
import City from './pages/City.vue'
import Main from './pages/Main.vue'
import Validator from './pages/Validator.vue'
import {Router, createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    { path: '/', component: Main },
    { path: '/:cityId', component: City },
    { path: '/:cityId/:validatorId', component: Validator },
    { path: '/:cityId/:validatorId/:ref', component: Validator }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
