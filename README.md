# @whyun/read-table

[![build status][action-image]][action-url]
[![GitHub license](https://img.shields.io/github/license/yunnysunny/read-table)](https://github.com/yunnysunny/read-table)
[![node version][node-image]][node-url]

[npm-url]: https://npmjs.org/package/@yunnysunny/@whyun/read-table
[action-image]: https://github.com/yunnysunny/read-table/workflows/CI/badge.svg
[action-url]: https://github.com/yunnysunny/read-table/actions/workflows/ci.yml

[node-image]: https://img.shields.io/badge/node.js-%3E=_12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

[![NPM](https://nodei.co/npm/@whyun/read-table.png?downloads=true)](https://nodei.co/npm/@whyun/read-table/) 

A tool for parsing command-line tabular output data.

## Install

npm install @whyun/read-table --save

## Usage
### Basic use
```javascript
const { parse } = require('@whyun/read-table');
const table = `
key1 key2 key3
aaa bbb ccc
111 222 333
`;
const rv = parse(table);
console.log(JSON.stringify(rv));
```
Will print `{"lines":[["aaa","bbb","ccc"],["111","222","333"]],"firstLine":["key1","key2","key3"]}`.
### With quotation fields
If field value has space, you can use quotation to wrapper it.
```javascript
const { parse } = require('@whyun/read-table');
const table2 = `
key1 key2 key3
aaa bbb "ccc xxx"
111 "222 yyy" 333
"222 zzz" 777 888
"333 888" "444 000" 444
`
const rv2 = parse(table2);
console.log(JSON.stringify(rv2));
```
Will print `{"lines":[["aaa","bbb","ccc xxx"],["111","222 yyy","333"],["222 zzz","777","888"],["333 888","444 000","444"]],"firstLine":["key1 000","444"]],"firstLine":["key1","key2","key3"]}`

## License

[MIT](LICENSE)

