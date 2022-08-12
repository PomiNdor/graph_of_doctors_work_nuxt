<template>
  <v-app light>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="true"
      app
    >
      <span>{{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>

const baseURL = 'https://medsystem-test04.medlock.ru';
window.fetchRequest = function(hook, init = {}) {
  let options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer mcaYN7oaLKiDEfF6QAqMlaF7oPVoIm',
      ActorToken: localStorage.getItem('actorToken') || '',
    },
  };

  for (let key in init) {
    if (key === 'headers') {
      options[key] = { ...options[key], ...init[key] };
      continue;
    }
    options[key] = init[key];
  }
  const url = baseURL + hook;
  return fetch(url, options);
};

export default {
  name: 'DefaultLayout',
  data () {
    return {
      fixed: false,
      title: 'Vuetify.js'
    }
  },
}
</script>
