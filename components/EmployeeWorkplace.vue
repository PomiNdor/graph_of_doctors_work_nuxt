<template>
  <v-card
    :class="{'deleted': isDelete}"
    class="px-5 pt-4 mt-4"
  >
    <v-btn
      class="btn-delete"
      width="20px"
      height="20px"
      color="red"
      dark
      fab
      @click="modifiedWorkplace('DELETED')"
    >
      <v-icon dark size="18px">mdi-minus</v-icon>
    </v-btn>
    <div>
      <v-select
        :items="buildings"
        v-model="currentWorkplace.filial"
        item-text="name"
        item-value="id"
        label="Филиал"
        @change="modifiedWorkplace('MODIFIED')"
      ></v-select>
    </div>
    <div>
      <v-select
        :items="specialities"
        v-model="currentWorkplace.speciality"
        item-text="name"
        item-value="id"
        label="Специальность"
        @change="modifiedWorkplace('MODIFIED')"
      ></v-select>
    </div>
  </v-card>
</template>

<script lang="ts">

import { Vue, Component, Prop, } from "vue-property-decorator";

interface Workplace {
  filial: number | null
  speciality: number | null
  doctor: number | null
}

@Component
export default class EmployeeWorkplace extends Vue {
  @Prop({ type: Object, default: null })
  readonly workplace!: Workplace | null

  currentWorkplace: Workplace = {
    filial: null,
    speciality: null,
    doctor: null,
  }
  status = ''

  get buildings() : Array<object> {
    return this.$store.state.buildings;
  }

  get specialities() : Array<object>  {
    return this.$store.state.specialities;
  }

  get isDelete() : boolean {
    return this.status === 'DELETED';
  }

  modifiedWorkplace(status : string) : void {
    if (this.isDelete)
      status = 'MODIFIED';
    this.status = status;

    let modifiedWorkplace = {...this.currentWorkplace, editStatus: status};
    this.$store.commit('updateWorkplace', modifiedWorkplace);
  }

  created() {
    if (this.workplace)
      this.currentWorkplace = { ...this.workplace };
  }

  // props: {
  //   workplace: {
  //     type: Object,
  //     default: null
  //   },
  // },
  // data () {
  //   return {
  //     currentWorkplace: {},
  //     status: '',
  //   }
  // },
  // computed: {
  //   buildings() {
  //     return this.$store.state.buildings;
  //   },
  //   specialities() {
  //     return this.$store.state.specialities;
  //   },
  //   isDelete() {
  //     return this.status === 'DELETED';
  //   },
  // },
  // methods: {
  //   modifiedWorkplace(status) {
  //     if (this.isDelete)
  //       status = 'MODIFIED';
  //     this.status = status;
  //
  //     let modifiedWorkplace = {...this.currentWorkplace, editStatus: status};
  //     this.$store.commit('updateWorkplace', modifiedWorkplace);
  //   },
  // },
  // created() {
  //   if (this.workplace)
  //     this.currentWorkplace = { ...this.workplace };
  // },
}
</script>

<style lang="scss">
.btn-delete {
  position: absolute;
  top: 0; right: 0;
  border-radius: 0 0 0 4px;
}

.deleted {
  opacity: 0.5;
}
</style>
