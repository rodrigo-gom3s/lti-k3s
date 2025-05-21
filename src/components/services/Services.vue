<script setup>
import { onMounted, ref, inject } from 'vue';
import Table from '@/tables/Table.vue';
import { ColumnsService } from './columns_service';
import axios from 'axios';
import ServiceForm from './ServiceForm.vue';
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
let services = ref([]);
const isDialogOpen = ref(false)
const updateTable = ref(false);
const openToast = inject('openToast');
let ingressSet = null

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

function getServices() {
  updateTable.value = true;
  services.value = [];
  axios.get('/v1/services')
    .then(response => {
      axios.get('/v1/ingress')
        .then(response2 => {
          response.data.items.forEach((service) => {
            ingressSet = null
            response2.data.items.forEach((ingress) => {
              if (service.metadata.name === ingress.spec.rules[0].http.paths[0].backend.service.name) {
                ingressSet = ingress.spec.rules[0].host;
              }
            });
            services.value.push({
            name: service.metadata.name,
            namespace: service.metadata.namespace,
            ip: service.spec.clusterIP,
            externalPort: service.spec.ports[0].port,
            internalPort: service.spec.ports[0].targetPort,
            creationTimestamp: getUptime(service.metadata.creationTimestamp),
            dnsEntry: ingressSet != null ? ingressSet : " --------- ",
            });
        });
        updateTable.value = false;
        }).catch(error => {
          throw error
        });
    })
    .catch(error => {
      openToast("Error fetching services", error.response?.data?.message || error.message , 'destructive');
      updateTable.value = false;
    });

    console.log(services.value)
}

provide('getServices', getServices);

onMounted(() => {
  getServices();
});
</script>

<template>
  <div class="px-20 py-20 h-screen">
    <h1 class="text-4xl text-white mb-12">Services / Ingress</h1>
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
                  <DialogTitle>Create Service</DialogTitle>
                  <DialogDescription>
                    Create a new service
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <ServiceForm @closeDialog="closeDialog" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
            <div v-if="updateTable" class="w-1/3 h-1/3 mx-auto items-center justify-center flex">
              <Preloader class="w-1/6 h-1/6"/>
            </div>
        <Table class="animate-fade mt-5" v-if="!updateTable" :data="services" :columns="ColumnsService" />
    </div>
  </div>
</template>