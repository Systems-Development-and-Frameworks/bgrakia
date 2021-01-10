<template>
  <div>
    <h1>{{ newsItem.title }} {{ (newsItem.votes) }}</h1>
    <button v-if="isAuth" class="upvote" @click="incrementVotes">Upvote</button>
    <button v-if="isAuth" class="downvote" @click="decrementVotes">Downvote</button>
    <button v-if="ownsPost" class="remove" @click="removeMe">Remove</button>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';
export default {
  name: "NewsItem",
  props: {
    newsItem: {
      title: {type: String, required: true},
      votes: {type: String, required: true},
      author: {type: Object, required: true}
    }
  },
  methods: {
    async incrementVotes() {
      const mutation = gql`
       mutation ($title: ID!) {
          upvote(title: $title) {
              votes
          }
       }
      `;
      try {
        const { data: {upvote}} = await this.$apollo.mutate({
          mutation, 
          variables: { title: this.newsItem.title }
        })
        this.$emit('updateNews', {...this.newsItem, votes: upvote.votes});
      }
      catch (e) { console.log(e.message); }
    },
    decrementVotes() {
      this.$emit('updateNews', { ...this.newsItem, votes: (this.newsItem.votes - 1)})
    },
    removeMe() {
      this.$emit('removeNews', this.newsItem)
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'isAuthenticated',
      user: 'getPrincipal'
    }),
    ownsPost() {
      return this.isAuth && this.user.id == this.newsItem.author.id;
    }
  }
}

</script>

<style scoped>

</style>