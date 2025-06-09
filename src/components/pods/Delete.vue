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
  axios.delete('v1/namespaces/' + props.row_value.namespace + '/pods/' + props.row_value.name)
    .then(() => {
      openToast('Pod deleted', 'The pod has been successfully deleted.', 'success')
      getPods()
    })
    .catch(error => {
      openToast('Error deleting pod', error.response?.data?.message || error.message, 'destructive')
    });
}
function deletePod() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this pod ?', 'Cancel', 'Yes',
    'Before deleting this pod, be sure that you are not using. This action cannot be undone.')
}
</script>

<template>
            <div @click="deletePod">
              <component :is="CircleX" class="mr-2 h-5" />
              <p>Delete Pod</p>
            </div>
</template>