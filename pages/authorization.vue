<template>
  <div class="d-flex flex-column align-center text-center">
    <h1>Авторизация</h1>
    <v-form
      class="col-6"
      method="POST"
      @submit.prevent="authorize"
    >
      <v-text-field
        v-model="username"
        label="Логин"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Пароль"
        required
      ></v-text-field>
      <v-btn
        type="submit"
      >Авторизоваться</v-btn>
    </v-form>
  </div>
</template>

<script>

export default {
  name: 'Authorization',
  data () {
    return {
      username: 'Groznyi',
      password: 'WfS0K2Fk',
      hook: "/token_actor_user/",
    }
  },
  methods: {
    async authorize() {
      var formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);

      try {
        let response = await window.fetchRequest(this.hook, {
          method: 'POST',
          body: formData,
        });

        let result = await response.json();
        if (!response.ok)
          throw new Error(result);

        this.saveActorToken(result.token);
        this.$router.push('/');
      } catch (e) {
        alert(e.message);
      }
    },
    saveActorToken(actorToken) {
      localStorage.actorToken = actorToken;
      localStorage.actorTokenTime = Date.now();
    },
  },
}
</script>
