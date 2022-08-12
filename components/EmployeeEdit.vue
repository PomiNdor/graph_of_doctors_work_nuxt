<template>
  <v-card class="d-flex">
    <v-col>
      <v-toolbar class="grey lighten-4">
        <v-toolbar-title>
          Рабочие места
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          @click="addWorkplace"
        >Добавить</v-btn>
      </v-toolbar>
      <div class="workplaces pr-4">
        <EmployeeWorkplace
          v-for="workplace in workplaces"
          :workplace="workplace"
          :key="workplace.id || workplace.createdId + Date.now()"
        ></EmployeeWorkplace>
      </div>
    </v-col>
    <v-col class="col-4">
      <v-form class="form" name="employeeEdit">
        <v-text-field
          v-model="user.surname"
          lable="Фамилия"
          required
        ></v-text-field>
        <v-text-field
          v-model="user.firstname"
          lable="Имя"
        ></v-text-field>
        <v-text-field
          v-model="user.secondname"
          lable="Отчество"
        ></v-text-field>

        <v-radio-group v-model="user.gender">
          <v-radio
            label="Мужчина"
            value="MALE"
          ></v-radio>
          <v-radio
            label="Женщина"
            value="FEMALE"
          ></v-radio>
        </v-radio-group>

        <div class="text-center">
          <v-btn
            type="submit"
            color="primary"
            @click.prevent="saveEmployee(isNewUser ? 'POST' : 'PATCH')"
          >Сохранить</v-btn>
          <v-btn
            type="submit"
            color="error"
            @click.prevent="deleteEmployee"
          >Удалить</v-btn>
          <v-btn
            plain
            @click="$router.push('/')"
          >Отмена</v-btn>
        </div>
      </v-form>
    </v-col>
  </v-card>
</template>

<script>

import EmployeeWorkplace from "@/components/EmployeeWorkplace.vue";
export default {
  name: 'EmployeeEdit',
  components: {
    EmployeeWorkplace,
  },
  data () {
    return {
      createdCount: 0,
      user: {
        surname: '',
        firstname: '',
        secondname: '',
        gender: 'MALE',
      },
    }
  },

  computed: {
    hook() {
      let result = '/staff/';
      if (this.userId !== undefined)
        result += this.userId+'/';
      return result;
    },
    userId() {
      if (this.$route.params.id)
        return +this.$route.params.id;
      return undefined;
    },
    isNewUser() {
      return this.user.id === undefined;
    },
    workplaces() {
      return this.$store.state.workplaces || [];
    },
    workplacesModified() {
      /* Вынес фильтр в геттер стора */
      return this.$store.getters.getWorkplacesModified;
    },
  },
  methods: {
    validateForm() {
      return this.user.surname !== ''
        && this.user.firstname !== ''
        && this.user.secondname !== ''
        && this.user.gender !== '';
    },
    async saveEmployee(method) {
      if (!this.validateForm()) {
        alert('Не все поля заполнены!');
        return;
      }
      var formData = new FormData();
      formData.append('surname', this.user.surname);
      formData.append('firstname', this.user.firstname);
      formData.append('secondname', this.user.secondname);
      formData.append('gender', this.user.gender);

      try {
        let response = await window.fetchRequest(this.hook, {
          method,
          body: formData
        });

        let result = await response.json();
        if (!response.ok)
          throw new Error(result);

        this.user.id = result.id;
        this.saveWorkplaces();
      } catch (e) {
        alert(e.message);
      }
    },
    async deleteEmployee() {
      try {
        let response = await window.fetchRequest(this.hook, {
          method: 'DELETE',
        });

        let result = await response.json();
        if (!response.ok)
          throw new Error(result);

        this.$router.push('/');
      } catch (e) {
        alert(e.message);
      }
    },

    async saveWorkplaces() {
      // запросы на рабочие места
      let workplacesRequest = [];
      for (let workplaceModified of this.workplacesModified) {
        // Если рабочее место новое и его удаляют
        if (this.isCreatedWorkplace(workplaceModified)
          && workplaceModified.editStatus === 'DELETED') {
          continue; // не нужно удалять не созданный workplace
        }
        if (!this.validateFormWorkplace(workplaceModified)) {
          alert('Рабочее место не будет сохранено, потому что не все поля заполнены!');
          continue;
        }
        workplacesRequest.push(this.createWorkplaceRequest(workplaceModified));
      }

      try {
        let responses = await Promise.all(workplacesRequest);
        for (let response of responses)
          if (!response.ok) {
            let result = await response.json();
            throw new Error(result);
          }

      } catch (e) {
        alert(e.message);
      } finally {
        this.$router.push('/');
      }
    },

    // ПОСМОТРЕТЬ
    createWorkplaceRequest(workplace) {
      let method = 'POST';
      let hook = '/workplace/';

      if (!this.isCreatedWorkplace(workplace)) {
        if (workplace.editStatus === 'DELETED') {
          method = 'DELETE';
          hook += workplace.id+'/';
        }
        else if (workplace.editStatus === 'MODIFIED') {
          method = 'PUT';
          hook += workplace.id+'/';
        }
      }

      const body = JSON.stringify({
        doctor: this.user.id,
        filial: workplace.filial,
        speciality: workplace.speciality,
      });

      // СЮДА
      return window.fetchRequest(hook, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    },

    isCreatedWorkplace(workplace) {
      return workplace.createdId !== undefined;
    },
    validateFormWorkplace(workplace) {
      return workplace.doctor !== null && workplace.filial !== null && workplace.speciality !== null;
    },

    addWorkplace() {
      this.$store.commit('addWorkplace',{
        filial: null,
        speciality: null,
        editStatus: 'MODIFIED',
        createdId: this.createdCount++
      });
    },

    loadUser() {
      this.user = {...this.$store.getters.getUserById(this.userId)};
    },
  },
  created() {
    if (this.userId !== undefined) {
      this.$store.dispatch('loadWorkplaces', this.userId);
      this.loadUser();
    }
  },
}
</script>

<style lang="scss">
.workplaces {
  max-height: 340px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;

    &-track {
      background: transparent;
    }

    &-thumb {
      background-color: #1976d2;
      border-radius: 8px;
    }
  }
}
</style>
