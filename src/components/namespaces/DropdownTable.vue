<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CircleX, Cross, MoreHorizontal, Pencil, Info } from 'lucide-vue-next'
import axios from 'axios'
import { onMounted, ref, inject } from 'vue'
import { ColumnsPod } from './columns_pods'
import Table from '@/tables/Table.vue';
import Delete from './Delete.vue'

const props = defineProps<{
  row_value
}>()

const pods = ref([])

function getPods() {
  pods.value = []
  axios.get('/v1/namespaces/' + props.row_value.name + '/pods')
    .then(response => {
      response.data.items.forEach((pod) => {
        pods.value.push({
          name: pod.metadata.name,
        })
      })
    })
}


onMounted(() => {
  getPods()
})

</script>

<template>
  <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem v-if="row_value.status === 'Active'" class="cursor-pointer">
            <Delete class="flex transition hover:text-red-500 " :row_value="props.row_value" />
          </DropdownMenuItem>
        <DropdownMenuItem>
          <DialogTrigger as-child>
            <div class="flex cursor-pointer">
              <component :is="Info" class="mr-2 h-5" />
              <span>Show Namespace Pods</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pods List</DialogTitle>
        <DialogDescription>
          List of pods associated to {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Table v-if="pods.length > 0" class="animate-fade" :data="pods" :columns="ColumnsPod"/>
      </div>
    </DialogContent>
  </Dialog>
</template>