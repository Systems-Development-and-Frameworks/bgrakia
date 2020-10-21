<template>
  <div>
    <news-item
        v-for="newsItem in sortedItems"
        :newsItem="newsItem"
        v-bind:key="newsItem.title"
        @updateNews="updateNews"
        @removeNews="removeNews" 
    ></news-item>
    <div class="form-div">
      <news-form
      :uniqueTitles="itemTitles"
      @addItem="addItem"
      />

    </div>
  </div>
</template>

<script>

import NewsItem from "@/components/NewsItem";
import NewsForm from "@/components/NewsForm";
// @ = v-on: 
// : = property passing

export default {
  name: "NewsList",
  components: {NewsItem, NewsForm},
  data: function () {
    return {
      newsItems: [
        {title: "Title_1", votes: 0},
        {title: "Title_2", votes: 0}
      ],
    }
  },
  methods: {
    updateNews(item) {
      let current = this.newsItems.findIndex(newsItem => newsItem.title === item.title);
      this.newsItems.splice(current, 1, item);
    },
    removeNews(title) {
      this.newsItems = this.newsItems.filter(item => item.title !== title)
    },
    addItem(title) {
      this.newsItems.push({title: title, votes: 0});
    }
  },
  computed: {
    sortedItems: function () {
      return [...this.newsItems].sort((a, b) => b.votes - a.votes);
    },
    itemTitles: function () {
      return this.newsItems.map(item => item.title);
    }
  }

}
</script>

<style>
.form-div {
  margin-top: 20px;
}

</style>