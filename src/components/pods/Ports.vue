<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  ports: {
    type: Array,
    required: true
  }
})

let isvalid = true

const portList = ref("")

function formatPorts(){
  props.ports.forEach((port) => {
    if(isNaN(port)){
      portList.value += '------'
      isvalid = false
      return
    }
  })
  if(isvalid){
    portList.value = props.ports.join(' | ')
  }
}

onMounted(() => {
  formatPorts()
})

</script>

<template>
  <div class="rounded-md border-2 p-2">
    <p>{{ portList }}</p> 
  </div>
</template>
