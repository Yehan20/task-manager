<script lang="ts" setup>
import { useTasks } from '@/stores/task';
import type { NewTask, Task } from '@/types/type';
import { AxiosError } from 'axios';
import { useField, useForm, } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseInputFeild from '@/components/BaseInputFeild.vue';


const props = defineProps<{
  id?: number;
  mode: 'edit' | 'create';
}>();


const { handleSubmit,
  setErrors
} = useForm({
  validationSchema: {
    description(value: string) {
      if (!value) return 'description required';

      return true;
    },

    title(value: string) {
      if (!value) return 'Title required';
      return true;
    },

    deadline(value: string) {
      if (!value) return 'Deadline required';
      return true;
    },

    priority(value: string) {
      if (value) return true;
      return 'Select priority.';
    },

    status(value: string) {
      if (props.mode === 'create') return true;
      if (value) return true;
      return 'Select status.';
    },
  },
});

const router = useRouter();

const taskStore = useTasks();


const title = useField('title');
const description = useField('description');
const deadline = useField('deadline');
const priority = useField<string | null>('priority');
const status = useField<string | null>('status');

const priorityDropdown = ref(['low', 'normal', 'high']);
const statusDropdown = ref(['completed', 'pending']);

const alert = ref(false);
const alertMessage = ref('');
const alertColor = ref<"success" | "error" | "info" | "warning">();

const timeout = ref(2000);
const loading = ref(false);
const formRef = ref();


const submit = handleSubmit(async (values) => {

  loading.value = true;
  alert.value = false;

  const createdtaskStore = {
    ...values,
  };

  try {
    alertColor.value = 'success';


    // update task
    if (props.mode === 'edit' && props.id) {

      await taskStore.update(props.id, values as Task);
      alert.value = true;
      alertMessage.value = 'Task Updated';
    }

    // Edit task
    else {

      delete createdtaskStore?.status;
      await taskStore.store(values as NewTask);
      alert.value = true;
      alertMessage.value = 'Task Created';
    }

    setTimeout(() => {
      router.push('/');
    }, timeout.value);


  } catch (e) {
    alertColor.value = 'error';
    if (e instanceof AxiosError)
      if (e.response?.status === 422) {

        alert.value = true;
        alertMessage.value = 'Failed to create the task'
        setErrors(e.response.data.errors)
      } else {

        alert.value = true;
        alertMessage.value = e.response?.data.message ?? 'Unexpected error';
      }
  } finally {
    loading.value = false;
  }
});


onMounted(async () => {

  // Only if we are editing
  if (props.mode === 'edit') {
    title.value.value = taskStore.selectedTask?.title;
    description.value.value = taskStore.selectedTask?.description;
    priority.value.value = taskStore.selectedTask?.priority as string;
    deadline.value.value = taskStore.selectedTask?.deadline;
    status.value.value = taskStore.selectedTask?.status as string;
  }
});
</script>

<template>
  <form class="mt-6" @submit.prevent="submit" :ref="formRef">
    <v-row class="align-start md:bg-primary">
      <v-col cols="12" sm="6">
        <!-- Date Picker -->
        <v-date-picker v-model="deadline.value.value" elevation="0" height="450" width="100%"
          class="mb-2 shadow bg-grey-lighten-4" color="deep-purple-darken-4" title="Select Deadline" />

        <div v-for="error in deadline.errors.value" class="text-error mb-6 text-xm">
          {{ error }}
        </div>

      </v-col>

      <v-col cols="12" sm="6" class="">
        <!-- title feild -->

        <BaseInputFeild v-model="title.value.value" :errorMessages="title.errors.value" label="Title" />

        <!-- description feild -->
        <v-textarea class="mb-3" rows="4" variant="outlined" v-model="description.value.value" density="comfortable"
          :error-messages="description.errors.value" :max-errors="description.errors.value.length" label="Description"
          auto-grow>
        </v-textarea>

        <!-- priority select -->
        <v-select v-model="priority.value.value" variant="outlined" density="comfortable"
          :error-messages="priority.errors.value" :max-errors="priority.errors.value.length" :items="priorityDropdown"
          label="Priority"></v-select>

        <!-- status select show when mode is edit -->

        <v-select v-if="mode === 'edit'" v-model="status.value.value" variant="outlined" density="comfortable"
          :error-messages="status.errors.value" :max-errors="status.errors.value.length" :items="statusDropdown"
          label="Status"></v-select>

        <!-- Add |  Update button -->
        <v-btn :disabled="loading" :loading="loading" class="text-none mb-4 mt-0" color="deep-purple-darken-4" type="submit"
          variant="flat">
          {{ mode === 'edit' ? 'Update Task' : 'Add Task' }}
        </v-btn>


        <!-- Alert -->
        <div>
          <v-alert v-model="alert" class="pt-2 pb-2" height="50" position="static" closable
            :icon="alertColor === 'success' ? 'mdi-check-circle' : 'mdi-alert'" :text="alertMessage" :type="alertColor" />
        </div>

      </v-col>
    </v-row>

  </form>




</template>

<style></style>
