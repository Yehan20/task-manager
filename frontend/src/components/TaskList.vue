<script setup lang="ts">
import { useTasks } from '@/stores/task';
import type { Task } from '@/types/type';
import { getTagColor } from '@/utils';
import { onMounted, ref } from 'vue';
import BaseSnackBar from '@/components/BaseSnackBar.vue';
import { AxiosError } from 'axios';
import TaskCard from '@/components/TaskCard.vue';
import type { DataTableHeader } from 'vuetify';

const taskStore = useTasks();

const itemsPerPage = ref(10);
const currentPage = ref(1);
const headers = ref<DataTableHeader[]>([
  {
    title: 'Title',
    align: 'start',
    sortable: false,
    key: 'title',
  },
  { title: 'Description', key: 'description', align: 'start', sortable:false },
  { title: 'Priority', key: 'priority', align: 'start', sortable:false },
  { title: 'Status', key: 'status', align: 'start', sortable:false },
  { title: 'Created', key: 'created_at', align: 'start',sortable:false },
  { title: 'Deadline', key: 'deadline', align: 'start',sortable:false },
  { title: 'Completed', key: 'completed_at', align: 'start',sortable:false },
  { title: 'Actions', key: 'actions', align: 'start', sortable: false },
]);
const loading = ref(false);
const loadingConfirmComplete = ref(false);
const loadingConfirmDelete = ref(false);
const totalItems = ref(0);
const deleteDialog = ref(false);
const completeDialog = ref(false);
const selectedTaskId = ref<number | null>(null);
const status = ref('');
const tab = ref(null);
const statuses = ref(['pending', 'completed']);
const snackBarMessage = ref('');
const snackbarColor = ref('');
const snackbar = ref(false);
const timeout = ref(1500);

//  Confirm dialogs for delete and complete
const showDeleteConfirmation = (task: Task) => {
  deleteDialog.value = true;
  selectedTaskId.value = task.id;
};
const showCompleteConfirmation = (task: Task) => {
  completeDialog.value = true;
  selectedTaskId.value = task.id;
};

// Delete the task
const handleDelete = async () => {
  loadingConfirmDelete.value = true;
  try {
    await taskStore.deleteTask(selectedTaskId.value as number);

    loadingConfirmDelete.value = false;
    snackbarColor.value = 'success';
    snackBarMessage.value = 'Task deleted ';
  } catch (e) {
    loadingConfirmDelete.value = false;
    snackbarColor.value = 'error';

    if (e instanceof AxiosError) {
      snackBarMessage.value = e.response?.data.message ?? 'Failed to completed';
    } else {
      snackBarMessage.value = 'Unexpected error occured';
    }
  } finally {
    deleteDialog.value = false;
    snackbar.value = true;
  }
};

// Compete the task
const handleComplete = async () => {
  loadingConfirmComplete.value = true;
  try {
    await taskStore.markTaskComplete(selectedTaskId.value as number);
    loadingConfirmComplete.value = true;

    snackbarColor.value = 'success';
    snackBarMessage.value = 'Task marked completed';
  } catch (e) {
    loadingConfirmComplete.value = false;
    snackbarColor.value = 'error';

    if (e instanceof AxiosError) {
      snackBarMessage.value = e.response?.data.message ?? 'Failed to completed';
    } else {
      snackBarMessage.value = 'Unexpected error occured';
    }
  } finally {
    completeDialog.value = false;
    snackbar.value = true;
  }
};

// Filter by status
const handleFilter = async (value: string) => {
  await loadTasks(1, itemsPerPage.value, value);
};

//  Reset the filter
const handleReset = async () => {
  status.value = '';
  await loadTasks(currentPage.value, itemsPerPage.value);
};

// Inital task fetch
async function loadTasks(page: number, itemsPerPage: number, status?: string) {
  loading.value = true;

  await taskStore.index(page, itemsPerPage, status);
  currentPage.value = taskStore.meta?.current_page as number;
  totalItems.value = taskStore.meta?.last_page as number;

  loading.value = false;
}

// Component is loaded
onMounted(async () => {
  if (!taskStore.tasks.length) {
    await loadTasks(1, itemsPerPage.value, status.value);
  }
});
</script>

<template>
  <v-card class="elevation-0 mb-4 pa-2 pa-md-6 bg-white">
    <h1>My Tasks</h1>
    <div class="d-md-flex justify-space-between mt-3">
      <div class="d-flex w-md-50">
        <!-- Filter Box -->
        <v-select
          max-width="400"
          :disabled="loading"
          label="Status"
          placeholder="Select "
          :items="statuses"
          density="compact"
          v-model="status"
          @update:modelValue="handleFilter"
          variant="outlined"
        />

        <!-- Reset Button -->
        <v-btn
          color="deep-purple-darken-4"
          class="ml-2"
          @click="handleReset"
          theme="dark"
          :disabled="loading"
          prepend-icon="mdi-restart"
        >
          Reset
        </v-btn>
      </div>

      <!-- New Task -->
      <v-btn
        color="deep-purple-darken-4"
        class="md-ml-2"
        theme="dark"
        prepend-icon="mdi-plus-box"
        :to="{
          name: 'task.create',
        }"
      >
        New Task
      </v-btn>
    </div>

    <v-card
      max-width="1200"
      elevation="0"
      class="shadow rounded-lg border border-deep-purple-darken-4 mt-4 mt-md-0"
    >
      <v-tabs v-model="tab" bg-color="deep-purple-darken-4" fixed-tabs>
        <v-tab :ripple="false" value="one">Table</v-tab>
        <v-tab :ripple="false" value="two">Grid</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <!-- Table view -->
          <v-tabs-window-item value="one">
            <v-data-table-server
              class="mt-2"
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="taskStore.tasks"
              :items-length="totalItems"
              :loading="loading"
              item-value="name"
              hide-default-footer
              hover
            >
              <!-- Desc -->
              <template v-slot:[`item.description`]="{ item }">
                {{ item.description.substring(1, 20) }}
              </template>

              <!-- Priority -->
              <template v-slot:[`item.priority`]="{ item }">
                <v-chip
                  :color="getTagColor(item.priority)"
                  variant="flat"
                  size="small"
                  class="text-uppercase"
                  label
                >
                  {{ item.priority }}
                </v-chip>
              </template>

              <!-- Actions -->
              <template v-slot:[`item.actions`]="{ item: item }">
                <div class="d-flex ga-1">
                  <!-- Completed -->
                  <v-btn
                    v-if="item.status === 'pending'"
                    variant="elevated"
                    size="small"
                    color="primary"
                    @click="showCompleteConfirmation(item)"
                  >
                    <v-icon dark right> mdi-checkbox-marked-circle </v-icon>

                    <v-tooltip activator="parent" location="top">Complete</v-tooltip>
                  </v-btn>

                  <!-- Edit button -->
                  <v-btn
                    variant="elevated"
                    size="small"
                    color="success"
                    :to="{
                      name: 'task.edit',
                      params: { id: item.id },
                    }"
                    class="d-flex justify-center align-center"
                  >
                    <v-icon color="white">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                  </v-btn>

                  <!-- Delete button -->
                  <v-btn
                    variant="elevated"
                    size="small"
                    color="red"
                    @click="showDeleteConfirmation(item)"
                    class="d-flex justify-center align-center"
                  >
                    <v-icon color="white">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                  </v-btn>
                </div>
              </template>
            </v-data-table-server>
          </v-tabs-window-item>

          <!-- Grid veiw -->
          <v-tabs-window-item value="two">
            <v-row>
              <v-col cols="6">
                <TaskCard
                  v-for="task in taskStore.pendingTasks"
                  :loading="loading"
                  :task="task"
                  :key="task.id"
                  @showDelete="(task: Task) => showDeleteConfirmation(task)"
                  @showComplete="(task: Task) => showCompleteConfirmation(task)"
                />
              </v-col>

              <v-col cols="6">
                <TaskCard
                  v-for="task in taskStore.completedTasks"
                  :loading="loading"
                  :task="task"
                  :key="task.id"
                  @showDelete="(task: Task) => showDeleteConfirmation(task)"
                  @showComplete="(task: Task) => showCompleteConfirmation(task)"
                />
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <!-- Paginaiton -->
    <v-pagination
      class="mt-4"
      rounded="circle"
      size="small"
      active-color="deep-purple-darken-4"
      :disabled="loading"
      variant="flat"
      @update:model-value="async (page) => await loadTasks(page, itemsPerPage, status)"
      v-model="currentPage"
      :length="totalItems"
    />

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" width="auto" :persistent="loadingConfirmDelete">
      <v-card
        variant="flat"
        max-width="500"
        color="#f4f7fd"
        text="Are you sure you want to delete this task."
        title="Delete task"
      >
        <template v-slot:actions>
          <v-btn
            color="deep-purple-darken-4"
            variant="flat"
            class=""
            text="Yes"
            @click="handleDelete"
            :disabled="loadingConfirmDelete"
            :loading="loadingConfirmDelete"
          />

          <v-btn
            color="deep-purple-darken-4"
            variant="flat"
            class=""
            text="No"
            @click="deleteDialog = false"
          />
        </template>
      </v-card>
    </v-dialog>

    <!-- Complete Task Confimration -->
    <v-dialog v-model="completeDialog" width="auto" :persistent="loadingConfirmComplete">
      <v-card
        max-width="400"
        text="Are you sure you want to confirm this task completed."
        title="Complete task"
      >
        <template v-slot:actions>
          <v-btn
            color="deep-purple-darken-4"
            variant="flat"
            class=""
            text="Yes"
            @click="handleComplete"
            :disabled="loadingConfirmComplete"
            :loading="loadingConfirmComplete"
          />
          <v-btn
            color="deep-purple-darken-4"
            variant="flat"
            class=""
            text="No"
            @click="completeDialog = false"
          />
        </template>
      </v-card>
    </v-dialog>

    <!-- Base snack bar -->
    <BaseSnackBar
      location="top right"
      v-model="snackbar"
      :timeout="timeout"
      :color="snackbarColor"
    >
      {{ snackBarMessage }}
    </BaseSnackBar>
  </v-card>
</template>

<style>
.v-table__wrapper table {
  width: 100% !important;
}
</style>
