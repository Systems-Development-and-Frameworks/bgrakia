<template>
  <div>
    <h1>{{ title }} {{ (votes) }}</h1>
    <button v-on:click="upvote">Upvote</button>
    <button v-on:click="downvote">Downvote</button>
    <button v-on:click="remove">Remove</button>
  </div>
</template>

<script>
export default {
  name: "NewsItem",
  props:["title","votes"],
  methods: {
    upvote: function () {
      this.$emit("upvoteNews", this)
    },
    downvote: function () {
      this.$emit("downvote", this)
    },
    remove: function () {
      this.$emit("removeItem", this.title)
    }

  }
}
</script>

<style scoped>

</style>