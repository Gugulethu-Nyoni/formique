import { createApp } from 'vue';
import App from './App.vue';
import { VueFormique } from 'vue-formique';

const app = createApp(App);

app.use(VueFormique);

app.mount('#app');
