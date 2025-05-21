<script setup>
import { ref, inject } from 'vue'
import {CircleX} from 'lucide-vue-next'
import axios from 'axios'
const openToast = inject('openToast')
var alertDialog = inject('alertDialog')
const getServices = inject('getServices')

const props = defineProps({
  row_value: {
    type: Object,
    required: true
  }
})

function deleteConfirmed() {
  axios.get('v1/namespaces/'+props.row_value.namespace+'/ingress/'+props.row_value.name).then(() => {
      axios.delete('v1/namespaces/'+props.row_value.namespace+'/ingress/'+props.row_value.name).catch((error) => {
        openToast('Error deleting service', error.response?.data?.message || error.message, 'destructive')
        return
      })
  }).catch((error) => {
    if(error.status != 404){
        openToast('Error deleting service', error.response?.data?.message || error.message, 'destructive')
        return
    }
  })

  axios.delete('v1/namespaces/'+props.row_value.namespace+'/services/'+props.row_value.name).then(() => {
        openToast('Service Deleted', 'The service has been successfully removed', 'success')
        getServices()
      }).catch((error) => {
        openToast('Error deleting service', error.response?.data?.message || error.message, 'destructive')
      })
}
function deleteService() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this service ?', 'Cancel', 'Yes',
    'If you delete this service you may lost connection to the pods using it. This action cannot be undone.')
}
</script>

<template>
            <div @click="deleteService">
              <component :is="CircleX" class="mr-2 h-5" />
            </div>
</template>