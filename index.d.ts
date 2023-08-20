
interface ReadTable {
  parse(output: string): {
    fistLine: string[],
    lines: string[][]
  }
}
declare const readTable: ReadTable
export default readTable