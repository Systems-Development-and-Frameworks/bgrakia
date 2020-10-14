<template>
  <div>
    <news-item
        v-for="newsItem in sortedItems"
        v-bind:title="newsItem.title"
        v-bind:votes="newsItem.votes"
        v-bind:key="newsItem.title"
        v-on:upvoteItem="upvoteNews" 
        v-on:downvoteItem="downvoteNews"
        v-on:removeNews="removeNews"
    ></news-item>
    <div class="form-div">
      <form v-on:submit.prevent class="form">
        <input v-model="newItemTitle" placeholder="News Item Title here">
        <button v-on:click="addItem">Insert item</button>
      </form>
    </div>
      
  </div>
</template>

<script>

import NewsItem from "@/components/NewsItem";

export default {
  name: "NewsList",
  components: {NewsItem},
  data: function() {
    return {
      newsItems: [
        {title: "Title_1", votes: 0},
        {title: "Title_2", votes: 0}
      ],
      newItemTitle: "",
    }
  },
  methods: {
    upvoteNews(title) {
      let toBeUpvoted = this.newsItems.find(item => item.title == title)
      toBeUpvoted.votes += 1
    }, 
    downvoteNews(title) {
      let toBeDownvoted = this.newsItems.find(item => item.title == title)
      toBeDownvoted.votes -= 1
    },
    removeNews(title) {
      this.newsItems = this.newsItems.filter(item => item.title !== title)
    },
    addItem() {
      this.newsItems.push({title: this.newItemTitle, votes: 0});
    }
  },
  computed: {
    sortedItems: function() {
      return [...this.newsItems].sort((a, b) => b.votes - a.votes);
    }
  }

}
</script>

<style>
  .form-div {
    margin-top: 20px;
  }
  
</style>