import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Delete from './Delete.vue'

interface Service{
    name: string
    status: string,
    'creation-time': string
}

export const ColumnsService: ColumnDef<Service>[] = [
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
        accessorKey: 'ip',
        header: 'Cluster IP',
    },
    {
        accessorKey: 'externalPort',
        header: 'External Port',
    },
    {
        accessorKey: 'internalPort',
        header: 'Internal Port'
    },
    {
        accessorKey: 'dnsEntry',
        header: 'DNS Entry',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            var row_value = row.original
          return h('div', { class: 'relative flex transition hover:text-red-500 cursor-pointer' }, h(Delete, {
            row_value,
          }))
        },
    }
]