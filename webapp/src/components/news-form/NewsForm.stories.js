import Vue from 'vue';
import Vuetify from 'vuetify';
import NewsForm from "./NewsForm.vue";

Vue.use(Vuetify);

/*
TODO:
fix "this.uniqueTitles" is undefined error -> NewsForm rules
*/

export default {
    title: 'Components/NewsForm', 
};

const Template = (args, {argTypes}) => ({
    components: { NewsForm },
    template: '<news-form />',
    props: Object.keys(argTypes)
});

export const Default = Template.bind({});