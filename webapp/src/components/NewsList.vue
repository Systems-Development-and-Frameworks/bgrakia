<template>
  <div>
    <news-item
        v-for="newsItem in $data"
        v-bind:title="newsItem.title"
        v-bind:votes="newsItem.votes"
        v-bind:key="newsItem.title"
        v-on:upvoteNews="upvoteNews($event)"
    ></news-item>
  </div>
</template>

<script>

import NewsItem from "@/components/NewsItem";

export default {
  name: "NewsList",
  components: {NewsItem},
  data() {
    return [
      {title: "Title_1", votes: 0},
      {title: "Title_2", votes: 0}
    ]
  },
  methods: {
    upvoteNews: function (itemToUpvote) {
      this.$data.find(item => item.title === itemToUpvote.title).votes += 1
    }
  }

}
</script>

<style scoped>

</style>