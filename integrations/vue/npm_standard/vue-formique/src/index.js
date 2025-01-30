import FormiqueComponent from './FormiqueComponent.vue';

export default FormiqueComponent;

// Optional: Export as a plugin for global registration
export const VueFormique = {
  install(app) {
    app.component('VueFormique', FormiqueComponent); // Registers it as <VueFormique />
  },
};
