<template>
  <div>
    <h1 class="text-center mb-6">Добавление сотрудника</h1>
    <EmployeeEdit></EmployeeEdit>
  </div>
</template>

<script>
import EmployeeEdit from "@/components/EmployeeEdit";
export default {
  name: 'employee',
  components: {
    EmployeeEdit
  },
}
</script>
