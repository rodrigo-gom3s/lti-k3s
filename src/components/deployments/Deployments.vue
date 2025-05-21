<script setup>
import { onMounted, ref, inject} from 'vue';
import Table from '@/tables/Table.vue';
import { ColumnsDeployment } from './columns_deployments';
import axios from 'axios';
import DeploymentForm from './DeploymentForm.vue';
import {provide} from 'vue'
import Preloader from '../Preloader.vue';

import {
  Dialog,
  DialogContent,
  DialogScrollContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CirclePlus } from 'lucide-vue-next';
let deployments = ref([]);
const isDialogOpen = ref(false)
const updateTable = ref(false);
const openToast = inject('openToast');

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

function getDeployments() {
  updateTable.value = true;
  deployments.value = []
  axios.get('/v1/deployments')
    .then(response => {
      response.data.items.forEach((deployment) => { 
      console.log(deployment.status) 
        deployments.value.push({
          name: deployment.metadata.name,
          replicas: (deployment.status.availableReplicas != undefined ? deployment.status.availableReplicas : '0') + '/' +deployment.spec.replicas,
          creationTimestamp: getUptime(deployment.metadata.creationTimestamp),
          namespace: deployment.metadata.namespace,
          app: deployment.spec.template.metadata.labels.app !== undefined ? deployment.spec.template.metadata.labels.app : deployment.spec.template.metadata.labels['k8s-app'],
          containers: deployment.spec.template.spec.containers.map(container => ({
            name: container.name,
            image: container.image,
            ports: container.ports,
          })),
        });
      });
      updateTable.value = false;
    })
    .catch(error => {
      openToast('Error fetching deployments', error.response?.data?.message || error.message, 'destructive');
      updateTable.value = false;
    });
}

provide('getDeployments', getDeployments);

onMounted(() => {
  getDeployments();
});
</script>

<template>
  <div class="px-20 py-20 h-screen">
    <h1 class="text-4xl text-white mb-12">Deployments</h1>
    <div class="pl-12 pt-12 pr-10 pb-10 rounded-lg shadow-2xl animate-fade w-full bg-white">
      <div class="flex space-x-3 border-none text-base">
          <div v-if="!updateTable" class="w-full h-10 flex justify-end animate-fade">
            <Dialog v-model:open="isDialogOpen">
              <DialogTrigger>
                <div class="flex cursor-pointer">
                  <component :is="CirclePlus" class="mr-2 h-5" />
                </div>
              </DialogTrigger>
              <DialogScrollContent>
                <DialogHeader>
                  <DialogTitle>Create Deployment</DialogTitle>
                  <DialogDescription>
                    Create a new deployment
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <DeploymentForm @closeDialog="closeDialog"/>
                </div>
              </DialogScrollContent>
            </Dialog>
          </div>
        </div>
            <div v-if="updateTable" class="w-1/3 h-1/3 mx-auto items-center justify-center flex">
              <Preloader class="w-1/6 h-1/6"/>
            </div>
        <Table class="animate-fade mt-5" v-if="!updateTable" :data="deployments" :columns="ColumnsDeployment"/>
    </div>
  </div>
</template>