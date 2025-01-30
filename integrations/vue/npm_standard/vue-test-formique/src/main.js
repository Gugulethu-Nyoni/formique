import { createApp } from 'vue';
import App from './App.vue';
import { VueFormique } from 'vue-formique'; // Import the plugin

const app = createApp(App);

// Use the plugin to register the component globally
app.use(VueFormique);

app.mount('#app');