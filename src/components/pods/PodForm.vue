<script setup>
import { ref, onMounted, inject, reactive, computed } from 'vue'
import axios from 'axios';
import Table from '@/tables/Table.vue';
import { ColumnsContainer } from './columns_containers';
import { CirclePlus } from 'lucide-vue-next';
import { set } from 'zod';

let pod = reactive({
  name: '',
  namespace: '',
  containers: []
})

let container = reactive({
  name: '',
  image: '',
  ports: ''
})

let updateTable = ref(false)
let updateSelect = ref(false)

let errors = reactive({
  name: '',
  namespace: '',
})
let haveError = false
let NAMESPACES = ref([])
const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getPods = inject('getPods')

function updateTableStatus() {
      setTimeout(() => {
      updateTable.value = false
    }, 1)
}

function getNamespaces() {
  updateSelect.value = true
  axios.get('/v1/namespaces').then(response => {
      NAMESPACES.value = response.data.items.map((namespace) => ({
        name: namespace.metadata.name,
      }))
      updateSelect.value = false
    })
    .catch(error => {
      console.error('Error fetching namespaces:', error)
      updateSelect.value = false
    })
}

const insertPod = async () => {
  try {
    const response = await axios.post('v1/namespaces/' + pod.namespace + '/pods', 
      {
          apiVersion: "v1",
          kind: "Pod",
          metadata: {
              name: pod.name
          },
          spec: {
            containers: pod.containers
          }
      }
    ).then(() => {
      openToast('Pod created', 'The pod has been successfully created.', 'success')
      getPods()
    })
  } catch (error) {
    openToast('Error creating namespace', error.response.data.match(/<p>.*?<\/p>/g)[0].replace(/<p>/g, "").replace(/<\/p>/g, ""), 'destructive')
  }
}

function addContainer() {
  errors.containers = ''
  if (container.name === '' || container.image === '' || container.ports === '') {
    errors.containers = 'All fields are required'
    return
  }

  updateTable.value = true

  pod.containers.push({
    name: container.name,
    image: container.image,
    ports: container.ports.split(',').map(port => ({ containerPort: parseInt(port.trim()) }))
  })
  container.name = ''
  container.image = ''
  container.ports = ''
    updateTableStatus()
}

const submitForm = () => {
  errors.name = ''
  errors.namespace = ''
  errors.containers = ''
  haveError = false
  if (pod.name === '') {
    errors.name = 'Name is required'
    haveError = true
  }
  if (pod.namespace === '') {
    errors.namespace = 'Namespace is required'
    haveError = true
  }
  if (pod.containers.length === 0) {
    errors.containers = 'At least one container is required'
    haveError = true
  }

  if (haveError) {
    return
  }
    insertPod()
    emit('closeDialog')
}


  onMounted(() => {
    getNamespaces()
  })
</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="pod.name" placeholder="Pod Name" />
            <div v-if="errors.name" >
                <p class="text-sm text-red-700 mt-4">{{errors.name}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Namespace</label>
            <select v-if="!updateSelect" v-model="pod.namespace" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                <option value="" disabled selected>Select a namespace</option>
                <option v-for="namespace in NAMESPACES" :value="namespace.name">{{ namespace.name }}</option>
            </select>
            <div v-if="errors.namespace" >
                <p class="text-sm text-red-700 mt-4">{{errors.namespace}} </p>
            </div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-4">
            <label class="block text-gray-700">Containers</label>
            <CirclePlus @click="addContainer" class="ml-auto cursor-pointer"/>
          </div>
            <div class="p-4 border rounded-lg">
              <div class="flex gap-2">
                <input type="text" name="containerName" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="container.name" placeholder="Name" />
                <input type="text" name="containerImage" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="container.image" placeholder="Image" />
              </div>
                <input type="text" name="containerPort" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="container.ports" placeholder="Port(s) (separated by commas)" />
              <div class="ps-2" v-if="errors.containers" >
                <p class="text-sm text-red-700 mt-4">{{errors.containers}} </p>
              </div>
            </div>

            <Table class="mt-2" v-if="!updateTable" :data="pod.containers" :columns="ColumnsContainer"/>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>