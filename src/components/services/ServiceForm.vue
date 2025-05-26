<script setup>
import { ref, onMounted, inject, reactive, computed, provide } from 'vue'
import axios from 'axios';

let service = reactive({
  name: '',
  namespace: '',
  dnsEntry: '',
  app: '',
  port: 0,
  targetPort: 0,
})

let updateSelect = ref(false)
let updateSelect2 = ref(false)

let errors = reactive({
  name: '',
  app: '',
  port: '',
  targetPort: '',
})

let haveError = false
let APPS = ref([])
const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getServices = inject('getServices')


function getApps() {
  updateSelect2.value = true
  axios.get('/v1/deployments').then(response => {
      response.data.items.forEach(app => {
        if (app.spec.template.metadata.labels.app != null) { 
          APPS.value.push({
            name: app.spec.template.metadata.labels.app,
            namespace: app.metadata.namespace,
          })
        }
      })
      updateSelect2.value = false
    })
    .catch(() => {
      updateSelect2.value = false
    })
}

const insertService = async () => {
  APPS.value.forEach(app => {
    if (app.name === service.app) {
      service.namespace = app.namespace
    }
  })

  axios.post('/v1/namespaces/'+ service.namespace +'/services', {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: service.name,
        namespace: service.namespace,
      },
      spec:{
        ports:[{
          port: service.port,
          targetPort: service.targetPort,
        }],
        selector: {
          app: service.app,
        },
      }
    }).then(() => {
        if(service.dnsEntry !== '') {
          axios.post('/v1/namespaces/' + service.namespace + '/ingress', {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
              name: service.name,
              namespace: service.namespace,
              annotations: {
                "traefik.ingress.kubernetes.io/router.entrypoints": "web"
              },
            },
            spec:{
              rules: [{
                 host: service.dnsEntry,
                  http: {
                    paths: [{
                      path: '/',
                      pathType: "Prefix",
                      backend:{
                        service:{
                          name: service.name,
                          port:{
                            number: service.port
                          }
                        }
                      }
                    }]
                  }
                }]
            },
      
        }).then(() =>{
          openToast('Service created','Service has been created successfully', 'success')
          getServices()
        }).catch((error) => {
          throw error
        })
      }else {
        openToast('Service created','Service has been created successfully', 'success')
        getServices()

      }
    }).catch((error) =>{
      openToast('Error creating service', error.response?.data?.message || error.message, 'destructive')
    })

}

const submitForm = () => {
  errors.name = ''
  errors.app = ''
  errors.port = ''
  errors.targetPort = ''
  errors.containers = ''
  haveError = false

  if (service.name === '') {
    errors.name = 'Name is required'
    haveError = true
  }
  if (service.app === '') {
    errors.app = 'Application is required'
    haveError = true
  }
  if (service.targetPort <= 0) {
    errors.targetPort = 'Internal Port is required'
    haveError = true
  }
  if (service.port <= 0) {
    errors.port = 'External Port is required'
    haveError = true
  }

  if (haveError) {
    return
  }
    insertService()
    emit('closeDialog')
}


  onMounted(() => {
    getApps()
  })
</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form  class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="service.name" placeholder="Service Name" />
            <div v-if="errors.name" >
                <p class="text-sm text-red-700 mt-4">{{errors.name}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">DNS Entry</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="service.dnsEntry" placeholder="Service DNS Entry" />
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Application</label>
            <select v-if="!updateSelect" v-model="service.app" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                <option value="" disabled selected>Select a application</option>
                <option v-for="app in APPS" :value="app.name">{{ app.name }}</option>
            </select>
            <div v-if="errors.app" >
                <p class="text-sm text-red-700 mt-4">{{errors.app}} </p>
            </div>
        </div>
        <div class="flex gap-2">
          <div class="mb-4">
              <label class="block text-gray-700">Internal Port</label>
              <input type="number" name="port" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="service.targetPort" placeholder="Internal Port" />
              <div v-if="errors.targetPort" >
                  <p class="text-sm text-red-700 mt-4">{{errors.targetPort}} </p>
              </div>
          </div>
          <div class="mb-4">
              <label class="block text-gray-700">External Port</label>
              <input type="number" name="targetPort" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="service.port" placeholder="External Port" />
              <div v-if="errors.port" >
                  <p class="text-sm text-red-700 mt-4">{{errors.port}} </p>
              </div>
          </div>
        </div>
        <button type="button" @click="submitForm" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700">Confirm</button>
    </form>
</div>
</template>