import type { ColumnDef } from '@tanstack/vue-table'
import Disabled from './Disabled.vue'
import { h } from 'vue'
import DropdownTable from './DropdownTable.vue'

interface Namespace{
    name: string
    status: string,
    'creation-time': string
}

export const ColumnsNamespace: ColumnDef<Namespace>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'creationTimestamp',
        header: 'Creation Time',
    },
    {
            header: 'Status',
            id: 'status',
            enableHiding: false,
            cell: ({ row }) => {
                var row_value = row.original
                return h('div', { class: 'relative' }, h(Disabled, {
                status: row_value.status,
                }))
            },
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