<script lang="ts" setup>

import { type Task } from '@/types/type';
import { getTagColor } from '@/utils';

defineProps<{
    task: Task
    loading: boolean
}>()

const emit = defineEmits<{

    showDelete: [value: Task]
    showComplete: [value: Task]
}>()

</script>

<template>

    <v-card class="my-4  border-primary border-2 "   color="#f7f7f7" :loading="loading">

       


        <v-card-title>
            {{ task.title }}
        </v-card-title>


        <v-card-subtitle>
            {{ task.description }}
        </v-card-subtitle>

        <v-card-text class="pb-2 pt-2">
            <v-chip :color="getTagColor(task.priority)" variant="flat" size="small" class="text-uppercase" label>
                {{ task.priority }}
            </v-chip>
            <div class="mt-3"> Deadline : {{ task.deadline }}</div>
            <div class="my-1"> Created at : {{ task.created_at }}</div>
            <div>
                Completed at : {{ task.completed_at ?? 'Not completed' }}
            </div>
        </v-card-text>

        <v-card-actions class="d-flex ga-1 pa-3 mt-0 pt-0">
            <!-- Completed -->
            <v-btn v-if="task.status === 'pending'" variant="elevated" size="small" color="primary"
                @click="emit('showComplete', task)">

                <v-icon dark right>
                    mdi-checkbox-marked-circle
                </v-icon>

                <v-tooltip activator="parent" location="top">Complete</v-tooltip>

            </v-btn>


            <!-- Edit button -->
            <v-btn variant="elevated" size="small" color="success" :to="{
                name: 'task.edit',
                params: { id: task.id },
            }" class="d-flex justify-center align-center">

                <v-icon color="white">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>

            </v-btn>

            <!-- Delete button -->
            <v-btn variant="elevated" size="small" color="red" @click="emit('showDelete', task)"
                class="d-flex justify-center align-center">
                <v-icon color="white">mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>

        </v-card-actions>

    </v-card>
</template>

<style></style>