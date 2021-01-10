<template>
  <div>
    <h1>{{ newsItem.title }} {{ (newsItem.votes) }}</h1>
    <button class="upvote" @click="incrementVotes">Upvote</button>
    <button class="downvote" @click="decrementVotes">Downvote</button>
    <button class="remove" @click="removeMe">Remove</button>
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