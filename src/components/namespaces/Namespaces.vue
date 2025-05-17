<script setup>
import { onMounted, ref } from 'vue';
import Table from '@/tables/Table.vue';
import { ColumnsNamespace } from './columns_namespace';
import axios from 'axios';
import NamespaceForm from './NamespaceForm.vue';
import {provide} from 'vue'
import Preloader from '../Preloader.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CirclePlus } from 'lucide-vue-next';
let namespaces = ref([]);
const isDialogOpen = ref(false)
const updateTable = ref(false);

const closeDialog = () => {
  isDialogOpen.value = false
}

function getUptime(creationTimestamp) {
  const createdAt = new Date(creationTimestamp);
  const now = new Date();
  const diffMs = now - createdAt;
  const diffSeconds = Math.floor(diffMs / 1000);


  if (diffSeconds < 60) {
    return diffSeconds + " second" + (diffSeconds !== 1 ? 's ago' : ' ago');
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
       return diffMinutes + " minute" + (diffMinutes !== 1 ? 's ago' : ' ago');

  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
      return diffHours + " hour" + (diffHours !== 1 ? 's ago' : ' ago');

  }

  const diffDays = Math.floor(diffHours / 24);
      return diffDays + " day" + (diffDays !== 1 ? 's ago' : ' ago');

}

function getNamespaces() {
  updateTable.value = true;
  axios.get('/v1/namespaces')
    .then(response => {
      namespaces.value = [];
      response.data.items.forEach((namespace) => {
        namespaces.value.push({
          name: namespace.metadata.name,
          status: namespace.status.phase,
          creationTimestamp: getUptime(namespace.metadata.creationTimestamp),
        });
        
      });

      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
    });
}

provide('getNamespaces', getNamespaces);

onMounted(() => {
  getNamespaces();
});
</script>

<template>
  <div class="px-20 py-20 h-screen">
    <h1 class="text-4xl text-white mb-12">Namespaces</h1>
    <div class="pl-12 pt-12 pr-10 pb-10 rounded-lg shadow-2xl animate-fade w-full bg-white">
      <div class="flex space-x-3 border-none text-base">
          <div v-if="!updateTable" class="w-full h-10 flex justify-end animate-fade">
            <Dialog v-model:open="isDialogOpen">
              <DialogTrigger>
                <div class="flex cursor-pointer">
                  <component :is="CirclePlus" class="mr-2 h-5" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Namespace</DialogTitle>
                  <DialogDescription>
                    Create a new namespace
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <NamespaceForm @closeDialog="closeDialog" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
            <div v-if="updateTable" class="w-1/3 h-1/3 mx-auto items-center justify-center flex">
              <Preloader class="w-1/6 h-1/6"/>
            </div>
        <Table class="animate-fade" v-if="!updateTable" :data="namespaces" :columns="ColumnsNamespace" />
    </div>
  </div>
</template>