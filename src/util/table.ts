import table from 'text-table';

export function tableWithHead(head: string[], rows: any[][]) {
    return table([head, ...rows.map((row) => row.map(String))]);
}
