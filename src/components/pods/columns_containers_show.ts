import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Ports from './Ports.vue'

interface Container{
    name: string,
    image: string,
    ports: Array<{
        containerPort: number
    }>
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
                ports: row_value.ports.map(containerPort =>  containerPort.containerPort),
                }))
            },
    }
]