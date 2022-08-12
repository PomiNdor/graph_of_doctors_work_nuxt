<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Cписок сотрудников</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        @click="employeeAdd"
      >Добавить сотрудника</v-btn>
    </v-toolbar>
    <v-list>
      <v-list-item
        v-for="user in users"
        title="Редактировать"
        :key="user.id"
        link
        @click="employeeEdit(user)"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ `${user.surname} ${user.firstname} ${user.secondname}`}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'IndexPage',
  computed: {
    users() {
      return this.$store.state.users;
    },
  },
  methods: {
    employeeAdd() {
      this.$router.push('/employee');
    },
    employeeEdit(user) {
      this.$router.push(`/employee/${user.id}`);
    },
  },
}
</script>
