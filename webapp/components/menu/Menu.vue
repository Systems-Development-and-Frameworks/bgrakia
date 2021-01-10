<template>
    <div>
        <v-app-bar
        dense
        light 
        >
        <v-toolbar-title>Blog</v-toolbar-title>
         <v-spacer></v-spacer>

        <v-btn v-if="logged" @click="logout">Logout</v-btn>
        <v-btn v-else><nuxt-link to="/login">Login</nuxt-link></v-btn>
        </v-app-bar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Menu',
    methods: {
        async logout() {
            await this.$apolloHelpers.onLogout(); // Deletes the cookie containing the token
            this.$store.commit('removePrincipal');
        },
    },
    computed: {
        ...mapGetters({
            logged: 'isAuthenticated', 
        })
    }
}
</script>

<style scoped>
    button a {
        color: inherit;
        text-decoration: none;
    }
</style>