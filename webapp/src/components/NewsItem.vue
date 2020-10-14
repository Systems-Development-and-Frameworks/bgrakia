<template>
  <div>
    <h1>{{ title }} {{ (votes) }}</h1>
    <button v-on:click="incrementVotes">Upvote</button>
    <button v-on:click="decrementVotes">Downvote</button>
    <button v-on:click="removeMe">Remove</button>
  </div>
</template>

<script>
export default {
  name: "NewsItem",
  props:["title","votes"],
  methods: {
    incrementVotes() {
      this.$emit('upvoteItem', this.title)
    },
    decrementVotes() {
      this.$emit('downvoteItem', this.title)
    },
    removeMe() {
      this.$emit('removeNews', this.title)
    }
  }
}
</script>

<style scoped>

</style>