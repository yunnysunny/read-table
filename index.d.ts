
interface ParseOptions {
  /**
   * @defaultValue [' ', '/t']
   */
  splitChars?: string[]
}
interface ReadTable {
  parse(output: string, options?: ParseOptions): {
    fistLine: string[],
    lines: string[][]
  }
  parseObject(output: string, options?: ParseOptions) : {
    fistLine: string[],
    records: Map<string, string>[]
  }
}
declare const readTable: ReadTable
export default readTable