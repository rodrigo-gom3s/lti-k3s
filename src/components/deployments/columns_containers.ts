import type { ColumnDef } from '@tanstack/vue-table'
import Disabled from './Disabled.vue'
import { h } from 'vue'
import DropdownTable from './DropdownTable.vue'
import Ports from './Ports.vue'

interface Container{
    name: string,
    image: string,
    ports: string
}

export const ColumnsContainer: ColumnDef<Container>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'image',
        header: 'Image',
    },
    {
            header: 'Ports',
            id: 'ports',
            enableHiding: false,
            cell: ({ row }) => {
                var row_value = row.original
                return h('div', { class: 'relative' }, h(Ports, {
                ports: row_value.ports,
                }))
            },
    },
]