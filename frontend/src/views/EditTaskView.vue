<script lang="ts" setup>
import TaskForm from '@/components/TaskForm.vue';

import TaskNotFound from '@/components/TaskNotFound.vue';
import TaskForbidden from '@/components/TaskForbidden.vue';

import { useTasks } from '@/stores/task';
import { onMounted } from 'vue';
import { AxiosError } from 'axios';
import { ref } from 'vue';

const props = defineProps<{
  id: number;
}>();

const taskStore = useTasks();
const component = ref();

onMounted(async () => {
  try {
    await taskStore.show(props.id);
  } catch (e) {
    if (e instanceof AxiosError) {
      // 404 should show not found component
      // 403 should show forbidden component
      // any other generel fail
      if (e.response?.status === 403) {
        component.value = TaskForbidden;
      }
      if (e.response?.status === 404) {
        component.value = TaskNotFound;
      }
    }
  }
});
</script>

<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" class="bg-white rounded-lg pa-4">
        <v-card max-width="1200" elevation="0">
          <v-progress-circular
            color="deep-purple-darken-4"
            class="d-flex"
            v-if="taskStore.status === 'pending'"
            indeterminate
            :size="69"
          />

          <v-sheet class="ma-2 pa-2" v-else-if="taskStore.status === 'success'">
            <div class="mb-3">
              <h1>Edit task</h1>
              <p>fill the form to create a task</p>
            </div>

            <TaskForm mode="edit" :id="id" />
          </v-sheet>

          <div v-else>
            <component :is="component" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
