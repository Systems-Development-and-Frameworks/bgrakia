import Vue from 'vue';
import Vuetify from 'vuetify';
import NewsItem from "./NewsItem.vue";

Vue.use(Vuetify);

export default {
    title: 'Components/NewsItem',
    component: NewsItem,  
    argTypes: {
        newsItem: { control: 'object', defaultValue: { title: 'Title_1', votes: 0} }
    },
}


const Template = (args, {argTypes}) => ({
    components: { NewsItem },
    template: '<news-item :newsItem="newsItem" />',
    props: Object.keys(argTypes)
});

export const Default = Template.bind({});
Default.args = {newsItem: {title: 'Title_1', votes: 0}}