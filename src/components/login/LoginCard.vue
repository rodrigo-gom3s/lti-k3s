<script setup>
const props = defineProps({
    login: {
        type: Object,
        required: true,
        default: () => ({ ip: ''})
    }
})
const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.login)
}


</script>

<template>
    <div class="p-4 flex border rounded-lg mb-3 shadow hover:bg-gray-100 cursor-pointer" @click="handleClick">
        IP:<p class="text-md font-semibold ms-2"> {{ props.login.ip }}</p>
    </div>
</template>