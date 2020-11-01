import NewsList from './NewsList.vue';
import NewsItem from '../news-item/NewsItem.vue';
import NewsForm from '../news-form/NewsForm.vue';
import 'vuetify/dist/vuetify.css';

export default {
    title: 'Components/NewsList',
    component: NewsList,  
}


const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NewsList, NewsItem, NewsForm },
    template:
      '<news-list />',
});

export const Default = Template.bind({});
//Default.decorators = [(Story) => <v-app><Story/></v-app>]