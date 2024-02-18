import table from 'text-table';

type Rowable = string | number | boolean | null | undefined;

/**
 * Create a table with a header
 */
export function tableWithHead(head: string[], rows: Rowable[][]) {
    return table([head, ...rows.map((row) => row.map(String))]);
}
