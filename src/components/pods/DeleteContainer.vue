<script setup>
import { ref, inject } from 'vue'
import {CircleX, Edit} from 'lucide-vue-next'


const props = defineProps({
  row_value: {
    type: Object,
    required: true
  },
  edit: {
    type: Boolean,
    default: false
  }
})
const deleteContainer = () =>{return false}

if(props.edit){
  deleteContainer = inject('deleteContainer')
}

</script>

<template>
            <div v-if="edit" @click="deleteContainer(props.row_value.index)">
              <component :is="CircleX" class="mr-2 h-5" />
            </div>
</template>