import FormiqueComponent from './FormiqueComponent.vue';

export const VueFormique = {
  install(app) {
    app.component('VueFormique', FormiqueComponent); // Registers it as <VueFormique />
  },
};

export { FormiqueComponent }; // Named export for the component
