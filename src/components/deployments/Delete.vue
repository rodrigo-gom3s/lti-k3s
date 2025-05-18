<script setup>
import { ref, inject } from 'vue'
import {CircleX} from 'lucide-vue-next'
import axios from 'axios'
const openToast = inject('openToast')
var alertDialog = inject('alertDialog')
const getPods = inject('getPods')

const props = defineProps({
  row_value: {
    type: Object,
    required: true
  }
})

function deleteConfirmed() {
  axios.delete('v1/namespaces/' + props.row_value.namespace + '/deployments/' + props.row_value.name)
    .then(response => {
      openToast('Deployment deleted', 'The deployment has been successfully deleted.', 'success')
      getPods()
    })
    .catch(error => {
      openToast('Error deleting deployment', error.response.data.match(/<p>.*?<\/p>/g)[0].replace(/<p>/g, "").replace(/<\/p>/g, ""), 'destructive')
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