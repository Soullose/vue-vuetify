import customPanel from './customPanel.vue';
customPanel.install = function (Vue) {
    Vue.component(customPanel.name, customPanel);
};

export default customPanel;
