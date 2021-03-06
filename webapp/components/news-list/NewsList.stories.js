import 'vuetify/dist/vuetify.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import NewsList from './NewsList.vue';

Vue.use(Vuetify);

export default {
    title: 'Components/NewsList',
    component: NewsList,  
}


const Template = () => ({
    components: { NewsList },
    template:
      '<news-list />',
});

export const Default = Template.bind({});
//Default.decorators = [(Story) => <v-app><Story/></v-app>]