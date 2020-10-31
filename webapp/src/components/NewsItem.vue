<template>
  <div>
    <h1>{{ newsItem.title }} {{ (newsItem.votes) }}</h1>
    <button @click="incrementVotes">Upvote</button>
    <button @click="decrementVotes">Downvote</button>
    <button @click="removeMe">Remove</button>
  </div>
</template>

<script>
export default {
  name: "NewsItem",
  props: {
    newsItem: {
      title: {type: String, required: true},
      votes: {type: String, required: true},
    }
  },
  methods: {
    incrementVotes() {
      this.$emit('updateNews', { ...this.newsItem, votes: (this.newsItem.votes + 1)})
    },
    decrementVotes() {
      this.$emit('updateNews', { ...this.newsItem, votes: (this.newsItem.votes - 1)})
    },
    removeMe() {
      this.$emit('removeNews', this.newsItem)
    }
  }
}
</script>

<style scoped>

</style>