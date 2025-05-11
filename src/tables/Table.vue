<script setup>
import DataTable from '@/tables/DataTable.vue';
const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <DataTable
        :columns="columns" 
        :data="data"
        class="w-full">
        </DataTable>
</template>