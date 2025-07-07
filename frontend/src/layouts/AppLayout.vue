<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue';

import { useAuthStore } from '@/stores/auth';
import { shallowRef } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const auth = useAuthStore();
const { mdAndDown } = useDisplay();


const group = ref(null);
const drawer = ref(false);

const loading = ref(false);

const items = [
  {
    title: 'Dashboard',
    value: '/',
  },
  {
    title: 'Create Task',
    value: '/task/create',
  },
];

const handleLogout = async () => {
  loading.value = true;
  try {
    await auth.logout();

  } catch (e) {
    loading.value = false;
  }
};

watch(group, () => {
  drawer.value = false;
});
</script>


<template>
  <v-card>
    <v-layout>


      <TheSidebar v-model="drawer" />

      <!-- Mobile Drawer -->

      <v-app-bar elevation="0" color="deep-purple-darken-4" title="Task Manager 1.2" id="">

        <v-spacer />

        <v-btn class="me-2" @click="handleLogout" :disabled="loading" :loading="loading">
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>

        <v-app-bar-nav-icon v-if="mdAndDown" variant="text" @click.stop="drawer = !drawer" />

      </v-app-bar>



      <v-main class="" style="min-height: 100vh; background: #f4f7fd">
        <router-view v-slot="{ Component }">
          <v-fade-transition hide-on-leave>
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-main>
    </v-layout>
  </v-card>
</template>
