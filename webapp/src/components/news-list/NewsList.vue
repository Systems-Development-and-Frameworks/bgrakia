<template>
  <div>
    <div v-if="sortedItems.length == 0">
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

export default {
  name: 'NewsList',
  components: { NewsItem, NewsForm },
  data: function() {
    return {
      newsItems: [
        { title: 'Title_1', votes: 0 },
        { title: 'Title_2', votes: 0 },
      ],
      descending: true,
    };
  },
  methods: {
    updateNews(newsToUpdate) {
      let current = this.newsItems.findIndex(newsItem => newsItem.title === newsToUpdate.title);
      this.newsItems.splice(current, 1, newsToUpdate);
    },
    removeNews(newsToRemove) {
      this.newsItems = this.newsItems.filter(item => item.title !== newsToRemove.title);
    },
    addItem(title) {
      this.newsItems.push({ title: title, votes: 0 });
    },
    toggleSortOrder() {
      this.descending = !this.descending;
    },
    noNews: function() {
      return this.newsItems.isEmpty();
    },
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

};
</script>

<style>
.topMargin {
  margin-top: 20px;
}
</style>