<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="credentials.email"
            :rules="nameRules"
            :counter="64"
            label="User name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="credentials.password"
            :rules="pwdRules"
            label="Password"
            required
            type="password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            v-on:submit.prevent
            class="mr-4"
            :disabled="!valid"
            @click="login"
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import gql from 'graphql-tag';

export default {
    name: 'LoginForm',
    data: () => ({
        valid: false,
        credentials: {
            "email": '',
            'password': '',
        },
    }),
    methods: {
        async login() {
            const creds = this.credentials;
            try {
                const { data: { login } } = await this.$apollo.mutate({
                    mutation: gql`mutation login($email: String!, $password: String!) {
                        login(email: $email, password: $password)
                    }`,
                    variables: creds,
                });

                await this.$apolloHelpers.onLogin(login); // Stores the token in a cookie called apollo-token
                this.$store.commit('setPrincipal', login);
            }
            catch (e) { 
            }
        }
    },
   computed: {
        nameRules() {
            return [
                name => !!name || 'User name is required!',
                name => name.length <= 64 || 'User name cannot exceed 64 chars!'
            ]
        },
        pwdRules() {
            return [
                pwd => !!pwd || 'Password is required',
                pwd => pwd.length >= 8 || 'Password must be at least 8 chars!'
            ]
        }
  },    
}
</script>