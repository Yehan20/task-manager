import type { NewTask, PaginationMeta, status, Task } from '@/types/type';
import axios from '../axios/axios';
import { defineStore } from 'pinia';

interface State {
  tasks: Task[];
  selectedTask: Task | null;
  status: status;
  meta: PaginationMeta | null;
}

export const useTasks = defineStore('Tasks', {
  state: (): State => ({
    tasks: [],
    selectedTask: null,
    status: 'idle',
    meta: null,
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter((task) => task.status === 'pending'),
    completedTasks: (state) => state.tasks.filter((task) => task.status === 'completed'),
  },

  actions: {
    async index(page = 1, items = 10, status?: string) {
      console.log(status);
      let url = `tasks?page=${page}&limit=${items}`;

      if (status) {
        url += `&status=${status}`;
      }
      try {
        this.status = 'pending';

        const response = await axios.get(url);

        this.tasks = response.data.data;
        this.meta = response.data.meta;
        this.status = 'success';
      } catch (error) {
        this.status = 'error';
        return error;
      }
    },

    async show(id: number) {
      this.status = 'pending';
      try {
        const response = await axios.get(`tasks/${id}`);
        this.selectedTask = response.data.data;
        this.status = 'success';
      } catch (error) {
        this.status = 'error';
        throw error;
      }
    },

    async store(payload: NewTask) {
      try {
        const response = await axios.post('tasks', payload);
        this.tasks.unshift(response.data.data);
      } catch (error) {
        throw error;
      }
    },

    async update(id: number, payload: Task) {
      try {
        const response = await axios.put(`tasks/${id}`, payload);

        this.updateTaskChange(response.data.data);
      } catch (error) {
        throw error;
      }
    },

    async markTaskComplete(id: number) {
      try {
        const response = await axios.patch(`tasks/${id}/complete`);

        this.updateTaskChange(response.data.data);
      } catch (error) {
        throw error;
      }
    },

    async deleteTask(id: number) {
      try {
        await axios.delete(`tasks/${id}`);
        const newTask = this.tasks.filter((task) => task.id !== id);
        this.tasks = newTask;
      } catch (error) {
        throw error;
      }
    },

    // Method to find the index and update changed task in tasks array
    updateTaskChange(updatedTask: Task) {
      const index = this.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) this.tasks[index] = updatedTask;
    },
  },
});
