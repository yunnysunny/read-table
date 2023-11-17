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
### Parse field by space
#### Basic use
```javascript
const { parseRaw } = require('@whyun/read-table');
const table = `
key1 key2 key3
aaa bbb ccc
111 222 333
`;
const rv = parseRaw(table);
console.log(JSON.stringify(rv));
```
Will print `{"lines":[["aaa","bbb","ccc"],["111","222","333"]],"firstLine":["key1","key2","key3"]}`.
#### With quotation fields
If field value has space, you can use quotation to wrapper it.
```javascript
const { parseRaw } = require('@whyun/read-table');
const table2 = `
key1 key2 key3
aaa bbb "ccc xxx"
111 "222 yyy" 333
"222 zzz" 777 888
"333 888" "444 000" 444
`
const rv2 = parseRaw(table2);
console.log(JSON.stringify(rv2));
```
Will print `{"lines":[["aaa","bbb","ccc xxx"],["111","222 yyy","333"],["222 zzz","777","888"],["333 888","444 000","444"]],"firstLine":["key1","key2","key3"]}`


### Parse with fixed table cell length
If all columns have fixed length, you can call function `parseFixed`.
```javascript

const { parseFixed } = require('');
const { lines } = parseFixed(`head1        head2     head3      
value10      value11   value12    
value20      value21   value22`);
console.log(lines);
```
Will print `[{"head1":"value10","head2":"value11","head3":"value12"},{"head1":"value20","head2":"value21","head3":"value22"}]`.
## License

[MIT](LICENSE)

