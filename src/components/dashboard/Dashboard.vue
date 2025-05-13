<script setup>
import { onMounted, ref, inject } from 'vue';
import { DonutChart } from '@/components/ui/chart-donut'
import axios from 'axios';
import Preloader from '../Preloader.vue';
let openToast = inject('openToast');
let data = ref([]);
let size_memory_capacity
let size_memory_used


let resources_units_base2 = {
  K: 2**10,
  M: 2**20,
  G: 2**30,
  T: 2**40,
  P: 2**50,
  E: 2**60
}

async function fetchNodesStatus() {
   axios.get('/nodes')
    .then(response => {
      axios.get('/nodes/metrics').then(response2 => {  
        let nodes_metrics = response2.data.items
        let nodes = response.data.items

        nodes.forEach(node => {
          nodes_metrics.forEach(node_metrics => {
            if (node.metadata.name == node_metrics.metadata.name) {
                size_memory_capacity = node.status.capacity.memory.charAt(node.status.capacity.memory.length - 2)
                size_memory_used = node_metrics.usage.memory.charAt(node_metrics.usage.memory.length - 2)
                node.status.capacity.memory = Number(node.status.capacity.memory.replace(/[a-zA-Z]/g, ''))
                node_metrics.usage.memory = Number(node_metrics.usage.memory.replace(/[a-zA-Z]/g, ''))
                node_metrics.usage.cpu = Number(node_metrics.usage.cpu.replace(/[a-zA-Z]/g, ''))
                node.status.capacity.cpu = Number(node.status.capacity.cpu)
                console.log(node_metrics)
                data.value.push([{
                  name: node.metadata.name + " (Used)",
                  node: node.metadata.name + " " + (node_metrics.metadata.labels['node-role.kubernetes.io/master'] == 'true' ? ' (Master)' : '(Worker)'),
                  memory_usage: Math.round(((node_metrics.usage.memory * resources_units_base2[size_memory_used]) / (node.status.capacity.memory * resources_units_base2[size_memory_capacity])) * 100),
                  processor_usage: Math.round((node_metrics.usage.cpu / (node.status.capacity.cpu * (10**9))) * 100)
                },{
                  name: node.metadata.name + " (Remaining)",
                  node: node.metadata.name,
                  memory_usage: 100 - Math.round(((node_metrics.usage.memory * resources_units_base2[size_memory_used]) / (node.status.capacity.memory * resources_units_base2[size_memory_capacity])) * 100),
                  processor_usage: 100 - Math.round((node_metrics.usage.cpu / (node.status.capacity.cpu * (10**9))) * 100)
                }]);
            }
          });
          
        });

      }).catch(() => {
        openToast('Error', 'Failed to fetch nodes metrics', 'destructive');
        return false
      });
    })
    .catch(() => {
      openToast('Error', 'Failed to fetch nodes', 'destructive');
      return false
    });
}

const valueFormatter = (tick) =>
  typeof tick === 'number'
    ? `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(tick * 1)}%`
    : '';

onMounted(() => {
  fetchNodesStatus();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen">
    <h1 class="text-4xl text-white mb-12">Dashboard</h1>
    <div v-if="data.length === 0" class="w-full h-full mx-auto items-center justify-center flex">
      <Preloader class="w-1/6 h-1/6"/>
    </div>
    <div v-if="data.length !== 0" class="bg-white rounded-lg shadow-2xl animate-fade w-full p-6">
      <h2 class="text-5xl font-light mx-10 my-5 text-black mb-6">Nodes</h2>
        <div class="xl:flex m-10 p-10 border-2 border-slate-500 rounded-xl" v-for="data_item in data">
            <div>
              <h2 class="text-3xl xl:flex font-light underline text-black mb-6">Node {{ data_item[0].node}}</h2>
            </div>
          <div class="flex flex-col mx-auto items-center">
            <p>{{ data_item.node }}</p>
            <DonutChart
              index="name"
              category="memory_usage"
              :data="data_item"
              type="pie"
              :colors="['#ff3017', '#1799ff']"
              :showLegend="true"
              :value-formatter="valueFormatter"
            />
            <p class="mb-2 text-black font-medium">Memory Usage (%)</p>

          </div>
          <div class="flex flex-col mx-auto content-end items-center">
            <DonutChart
              index="node"
              category="processor_usage"
              :data="data_item"
              type="pie"
              :colors="['#ff3017', '#1799ff']"
              :showLegend="true"
              :value-formatter="valueFormatter"
            />
            <p class="mb-2 text-black font-medium">CPU Usage (%)</p>

          </div>
        </div>
    </div>
    <div class="h-10"></div>
  </div>
</template>
