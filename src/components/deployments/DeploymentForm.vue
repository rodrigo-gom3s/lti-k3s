<script setup>
import { ref, onMounted, inject, reactive, computed, provide } from 'vue'
import axios from 'axios';
import Table from '@/tables/Table.vue';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ColumnsContainer } from './columns_containers';
import { CirclePlus } from 'lucide-vue-next';;

let deployment = reactive({
  name: '',
  podName: '',
  namespace: '',
  replicas: 1,
  containers: []
})


let container = reactive({
  name: '',
  image: '',
  ports: []
})

let updateTable = ref(false)
let updateSelect = ref(false)

let errors = reactive({
  name: '',
  namespace: '',
  replicas: '',
  podName: '',
})
let haveError = false
let NAMESPACES = ref([])

function updateTableStatus() {
      updateTable.value = true
      setTimeout(() => {
      updateTable.value = false
    }, 10)
}

function deleteContainer(index){
  deployment.containers.splice(index, 1)
  updateTableStatus()
}

provide('deleteContainer', deleteContainer)
const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getDeployments = inject('getDeployments')


function getNamespaces() {
  updateSelect.value = true
  axios.get('/v1/namespaces').then(response => {
      NAMESPACES.value = response.data.items.map((namespace) => ({
        name: namespace.metadata.name,
      }))
      updateSelect.value = false
    })
    .catch(error => {
      updateSelect.value = false
    })
}

const insertDeployment = async () => {
axios.post('v1/namespaces/' + deployment.namespace + '/deployments', 
      {
          apiVersion: "apps/v1",
          kind: "Deployment",
          metadata: {
              name: deployment.name
          },
          spec: {
            replicas: deployment.replicas,
            selector: {
              matchLabels: {
                app: deployment.podName
              }
            },
            template: {
              metadata: {
                labels: {
                  app: deployment.podName
                }
              },
            spec: {
              containers: deployment.containers.map(container => ({
                name: container.name,
                image: container.image,
                ports: container.ports.map(port => ({
                  containerPort: Number(port)
                }))
              }))
            }
            }
          }
      }
    ).then(() => {
      openToast('Deployment created', 'The deployment has been successfully created.', 'success')
      getDeployments()
    }).catch(error =>{
    openToast('Error creating deployment', error.response?.data?.message || error.message, 'destructive')
  })
}

function addContainer() {
  errors.containers = ''
  if (container.name === '' || container.image === '' || container.ports.length === 0) {
    errors.containers = 'All fields are required'
    return
  }

  updateTable.value = true

  deployment.containers.push({
    name: container.name,
    image: container.image,
    ports: container.ports
  })
  container.name = ''
  container.image = ''
  container.ports = []
    updateTableStatus()
}

const submitForm = () => {
  errors.name = ''
  errors.namespace = ''
  errors.containers = ''
  haveError = false
  if (deployment.name === '') {
    errors.name = 'Name is required'
    haveError = true
  }
  if (deployment.podName === '') {
    errors.podName = 'Pod Name is required'
    haveError = true
  }
  if (deployment.replicas < 1) {
    errors.replicas = 'The replicas amount must be at least 1'
    haveError = true
  }
  if (deployment.namespace === '') {
    errors.namespace = 'Namespace is required'
    haveError = true
  }
  if (deployment.containers.length === 0) {
    errors.containers = 'At least one container is required'
    haveError = true
  }

  if (haveError) {
    return
  }
    insertDeployment()
    emit('closeDialog')
}


  onMounted(() => {
    getNamespaces()
  })
</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Deployment Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="deployment.name" placeholder="Deployment Name" />
            <div v-if="errors.name" >
                <p class="text-sm text-red-700 mt-4">{{errors.name}} </p>
            </div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class=" basis-5/6">
              <label class="block text-gray-700">Pod Name</label>
              <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="deployment.podName" placeholder="Pod Name" />
              <div v-if="errors.podName" >
                  <p class="text-sm text-red-700 mt-4">{{errors.podName}} </p>
              </div>
          </div>
          <div >
              <label class="block text-gray-700">Replicas</label>
              <input type="number" name="replicas" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="deployment.replicas" placeholder="Pod Amount of Replicas" />
              <div v-if="errors.replicas" >
                  <p class="text-sm text-red-700 mt-4">{{errors.replicas}} </p>
              </div>
          </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Namespace</label>
            <select v-if="!updateSelect" v-model="deployment.namespace" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
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
                  <TagsInput v-model="container.ports" class="mt-2">
                  <TagsInputItem v-for="item in container.ports" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                    <TagsInputInput placeholder="Ports of the container" />
                  </TagsInput>
              <div class="ps-2" v-if="errors.containers" >
                <p class="text-sm text-red-700 mt-4">{{errors.containers}} </p>
              </div>
            </div>

            <Table class="mt-2" v-if="!updateTable" :data="deployment.containers" :columns="ColumnsContainer"/>
        </div>
        <button type="button" @click="submitForm" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>