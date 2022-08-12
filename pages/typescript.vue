<template>
  <div>
    <EmployeeWorkplace

    />
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator"


@Component({
})
export default class MyClass extends Vue {
  message = 'Hello'
  firstName = 'John'
  lastName = 'Doe'
  currentWorkplace = {}
  status = ''

  // Declared as computed property getter
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  hello() {
    alert('hello ' + this.name)
  }
}
</script>

