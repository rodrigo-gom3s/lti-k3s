import type { ColumnDef } from '@tanstack/vue-table'

interface Pod{
    name: string
    status: string,
    'creation-time': string
}

export const ColumnsPod: ColumnDef<Pod>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    }
]