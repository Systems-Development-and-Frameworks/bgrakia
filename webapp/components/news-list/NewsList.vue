<template>
  <div>
    <div v-if="sortedItems.length < 1">
      <h2>The list is empty :(</h2>
    </div>

    <div v-else>
      <news-item
        v-for="newsItem in sortedItems"
        :newsItem="newsItem"
        v-bind:key="newsItem.title"
        @updateNews="updateNews"
        @removeNews="removeNews"
      />
    </div>

    <div class="topMargin">
      <button class="sorter" @click="toggleSortOrder">Change sort order</button>
    </div>

    <div class="topMargin">
      <news-form
        :uniqueTitles="itemTitles"
        @addItem="addItem"
      />
    </div>
  </div>
</template>

<script>

import NewsItem from '@/components/news-item/NewsItem';
import NewsForm from '@/components/news-form/NewsForm';
import gql from 'graphql-tag';
import { mapGetters } from 'vuex'

export default {
  name: 'NewsList',
  components: { NewsItem, NewsForm },

  data: () => {
    return {
      newsItems: [],
      descending: true,
    }
  },
  methods: {
    updateNews(newsToUpdate) {
      let current = this.newsItems.findIndex(newsItem => newsItem.title === newsToUpdate.title);
      this.newsItems.splice(current, 1, newsToUpdate);
    },
    async removeNews(newsToRemove) {
      const mutation = gql`
        mutation($title: ID!) {
          delete(title: $title) {
            title
          }
        }
      `;
      try {
        const { data } = await this.$apollo.mutate({ mutation, variables: { title: newsToRemove.title }});
        const { title } = data.delete;
        this.newsItems = this.newsItems.filter(item => item.title !== title);
      }
      catch (e) { console.log(e.message); }
    },
    async addItem(title) {
      const mutation = gql`
        mutation($post: PostInput!) {
            write(post: $post) {
                title,
                votes,
                author {
                  id
                }
            }
        }
      `;
      const variables = { post: { title } };
      try {
          const { data: { write } } = await this.$apollo.mutate({ mutation, variables })
          this.newsItems.push({ title: write.title, votes: write.votes, author: write.author});
      }
      catch (e) { console.log(e.message) }
    },
    toggleSortOrder() {
      this.descending = !this.descending;
    },
    async getNews() {
      const query = gql`
        query {
            posts {
                title
                votes
                author {
                  id
                }
            }
        }
      `;
      try {
        const { data: { posts }} = await this.$apollo.query( { query } );
        return posts;
      }
      catch (e) {
        return [];
      }
    }
  },
  computed: {
    sortedItems: function() {
      return this.descending
        ?
        [...this.newsItems].sort((a, b) => b.votes - a.votes)
        :
        [...this.newsItems].sort((a, b) => a.votes - b.votes);
    },
    itemTitles: function() {
      return this.newsItems.map(item => item.title);
    },
  },
  async mounted() {
    this.newsItems = await this.getNews();
  },
};
</script>

<style>
.topMargin {
  margin-top: 20px;
}
</style>
