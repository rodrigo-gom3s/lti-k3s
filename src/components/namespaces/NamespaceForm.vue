<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios';

let namespace_name = ref('')
const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getNamespaces = inject('getNamespaces')
const error_message_name = ref('')


const insertNamespace = async () => {
  try {
    const response = await axios.post('v1/namespaces', 
      {
          apiVersion: "v1",
          kind: "Namespace",
          metadata: {
              name: namespace_name.value
          }
      }
    ).then(() => {
      getNamespaces()
      openToast('Namespace created', 'The namespace has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error creating namespace', error.response.data.match(/<p>.*?<\/p>/g)[0].replace(/<p>/g, "").replace(/<\/p>/g, ""), 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''

  if (namespace_name.value === '') {
    error_message_name.value = 'Namespace name is required'
    return
  }
    insertNamespace()
    emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="namespace_name" placeholder="Namespace Name" />
            <div v-if="error_message_name" >
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>