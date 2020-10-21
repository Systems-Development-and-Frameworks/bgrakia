<template>
    <form @submit.prevent class="form">
        <input v-model="newItemTitle" placeholder="News Item Title here">
        <button @click="addItem">Insert item</button>
    </form>
</template>

<script>
export default {
    name: "NewsForm",
    "props": ["uniqueTitles"],
    data: function() {
        return {
            newItemTitle: "",
        }
    },
    methods: {
        addItem() {
            let isEmpty = this.newItemTitle.length;
            let isPresent = this.uniqueTitles.includes(this.newItemTitle);
            if (isPresent || !isEmpty) {
                alert("There is an article with this title.");
                return;
            }
            this.$emit('addItem', this.newItemTitle);
            this.newItemTitle = "";
        }
    }
}
</script>