<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  ports: {
    type: Array,
    required: true
  }
})

console.log("Props: ", props.ports)

const portList = ref("")

function formatPorts(){
  props.ports.forEach((port, index) => {
    if (props.ports.length == 1) {
      portList.value += port.containerPort
    } else {
        console.log("Port: ", port)
        if (props.ports.length - 1 == index) {
          portList.value += port.containerPort
        } else {
          portList.value += port.containerPort + ' | '
        }
    }
  })
}

onMounted(() => {
  formatPorts()
})

console.log("Ports: ", portList)
</script>

<template>
  <div class="rounded-md border-2 p-2">
    <p>{{ portList }}</p> 
  </div>
</template>
