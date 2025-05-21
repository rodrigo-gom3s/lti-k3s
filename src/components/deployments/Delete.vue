<script setup>
import { ref, inject } from 'vue'
import { CircleX } from 'lucide-vue-next'
import axios from 'axios'
const openToast = inject('openToast')
var alertDialog = inject('alertDialog')
const getDeployments = inject('getDeployments')

const props = defineProps({
  row_value: {
    type: Object,
    required: true
  }
})

function deleteConfirmed() {
  axios.delete('v1/namespaces/' + props.row_value.namespace + '/deployments/' + props.row_value.name)
    .then(() => {
      axios.get('/v1/namespaces/' + props.row_value.namespace + '/services')
        .then(response => {
          response.data.items.forEach((service) => {
            if (service.spec.selector.app == props.row_value.app && props.row_value.app !== undefined) {
              axios.get('v1/namespaces/' + props.row_value.namespace + '/ingress/' + service.metadata.name).then(() => {
                axios.delete('v1/namespaces/' + props.row_value.namespace + '/ingress/' + service.metadata.name).catch((error) => {
                  throw error
                })
              }).catch((error) => {
                if (error.status != 404) {
                  throw error
                }
              })
              axios.delete('v1/namespaces/' + props.row_value.namespace + '/services/' + service.metadata.name).then(() => {
                openToast('Deployment deleted', 'The deployment has been successfully deleted.', 'success')
                getDeployments()
                return
              }).catch((error) => {
                throw error
              })
            }
          });
            openToast('Deployment deleted', 'The deployment has been successfully deleted.', 'success')
            getDeployments()
        })
    })
    .catch(error => {
      openToast('Error deleting deployment', error.response?.data?.message || error.message, 'destructive')
    });
}
function deleteDeployment() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this deployment ?', 'Cancel', 'Yes',
    'Before deleting this deployment, be sure that you are not using any of its pods . This action cannot be undone.')
}
</script>

<template>
  <div @click="deleteDeployment">
    <component :is="CircleX" class="mr-2 h-5" />
    <p>Delete Deployment</p>
  </div>
</template>