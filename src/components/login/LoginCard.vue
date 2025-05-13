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

console.log('LoginCard props:', props.login)

</script>

<template>
    <div class="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer" @click="handleClick">
        <p class="text-lg font-semibold">IP: {{ props.login.ip }}</p>
    </div>
</template>