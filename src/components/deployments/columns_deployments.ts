import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import DropdownTable from './DropdownTable.vue'

interface Deployment{
    name: string
    status: string,
    'creation-time': string
}

export const ColumnsDeployment: ColumnDef<Deployment>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'creationTimestamp',
        header: 'Creation Time',
    },
    {
        accessorKey: 'namespace',
        header: 'Namespace',
    },
    {
            header: 'Replicas Running',
            accessorKey: 'replicas',
    },
    {
        header: 'Aplication Name',
        accessorKey: 'app',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            var row_value = row.original
          return h('div', { class: 'relative' }, h(DropdownTable, {
            row_value,
          }))
        },
    }
]