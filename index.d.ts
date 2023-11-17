
export interface ParseOptions {
  /**
   * @defaultValue [' ', '/t']
   */
  splitChars?: string[]
}
export interface FieldName {
  begin: number
  end: number
  name: string
  len: number
}
export interface Line {
  [fieldName: string]: string
}
export interface RawLines {
  fistLine: string[],
  lines: string[][]
}
export interface ObjectLines {
  fistLine: string[],
  records: Map<string, string>[]
}
export interface Head {
  fieldNames: FieldName[]
  firstLenEnd: number
}
export interface FixedLines {
  lines: Line[]
  fieldNames: FieldName[]
}
export interface ReadTable {
  parseRaw(output: string, options?: ParseOptions): RawLines
  parseRaw2Object(output: string, options?: ParseOptions) : ObjectLines
  parseFixed(output: string): FixedLines
}
declare const readTable: ReadTable
export default readTable