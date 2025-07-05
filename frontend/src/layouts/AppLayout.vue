<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon v-if="mdAndDown" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            </v-app-bar>

            <!-- Mobile Drawer -->
            <v-navigation-drawer v-if="mdAndDown" class="bg-deep-purple" theme="dark" v-model="drawer"
                :location="$vuetify.display.mobile ? 'left' : undefined" temporary>
                <v-list :items="items" color="transparent" />


                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block>
                            Logout
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>


            <!-- Desktop Drawer -->
            <v-navigation-drawer v-if="!mdAndDown" class="bg-deep-purple" theme="dark" permanant>
                <v-list :items="items" color="transparent" />

                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn @click="handleLogout"  :disabled="loading" :loading="loading"   block>
                            Logout
                        </v-btn>
<!-- 
                        <v-btn :disabled="loading" :loading="loading" class="text-none mb-4 rounded-full"
                            color="indigo-darken-3" type="submit" size="large" variant="flat" block>
                            Login
                        </v-btn> -->
                    </div>


                </template>
            </v-navigation-drawer>

            <v-main style="min-height:100vh;">
                <slot />
            </v-main>
        </v-layout>
    </v-card>
</template>
<script setup lang="ts">

import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const auth = useAuthStore();
const { mdAndDown } = useDisplay()
const router = useRouter();

const group = ref(null)
const drawer = ref(false);

const loading = ref(false)

const items = [
    {
        title: 'Dashboard',
        value: 'foo',
    },
    {
        title: 'Create Task',
        value: 'bar',
    },
]

const handleLogout = async () => {
    loading.value = true;
    try {
        await auth.logout();
        loading.value = false;
     
    } catch (e) {
        loading.value = false;
    }

}


watch(group, () => {
    drawer.value = false
})

</script>