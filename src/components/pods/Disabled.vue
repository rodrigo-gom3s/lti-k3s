<script setup>
import {ref} from 'vue'
import { boolean } from 'zod';

const props = defineProps(
    {
        status: {
        type: String,
        required: true
        }
    }
)

</script>

<template>
<div  class="flex items-center">
    <div class="w-4 h-4 rounded-full" :class="props.status === 'Active' ? 'bg-green-500' : 'bg-red-500'"></div>
    <p class="ms-2 align-middle">{{ props.status }}</p>
</div>

</template>