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
    template: '<news-form v-bind="$props"/>',
    props: Object.keys(argTypes)
});

export const Default = Template.bind({});

Default.args = {
  uniqueTitles: [] // you can create another story with a non empty list as default value
}