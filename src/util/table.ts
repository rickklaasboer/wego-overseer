import table from 'text-table';

export function tableWithHead(head: string[], rows: string[][]) {
    return table([head, ...rows]);
}
