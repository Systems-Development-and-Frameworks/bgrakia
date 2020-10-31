<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newsTitle"
            :rules="rules"
            :counter="64"
            label="News Title"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            class="mr-4"
            :disabled="!valid"
            @click="submit"
          >
            submit
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>


<script>
export default {
  name: 'NewsForm',
  'props': ['uniqueTitles'],
  data: () => ({
    valid: false,
    newsTitle: '',
  }), methods: {
    submit() {
      this.$emit('addItem', this.newsTitle);
      this.newsTitle = '';
    },
  },
  computed: {
    rules() {
      return [
        v => !!v || 'News-Title is required!',
        v => v.length <= 64 || 'News-Title must be less than 64 characters!',
        v => !this.uniqueTitles.includes(v) || 'News-Title already exists. Please enter a unique one!',
      ];
    },
  },
};
</script>