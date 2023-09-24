const { parse } = require('..');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { parse2Object } = require('..');
describe('basic test', function () {
    it('plain field', function () {
        const table = `
key1 key2 key3
aaa bbb ccc
111 222 333
        `;
        const rv = parse(table);
        expect(rv).to.deep.equal({
            'lines': [
                ['aaa', 'bbb', 'ccc'],
                ['111', '222', '333']],
            'firstLine': ['key1', 'key2', 'key3']
        });
    });
    it('quotation filed', function () {

        const table2 = `
key1 key2 key3
aaa bbb "ccc xxx"
111 "222 yyy" 333
"222 zzz" 777 888
"333 888" "444 000" 444
        `;
        const rv2 = parse(table2);
        expect(rv2).to.deep.equal({
            'lines': [
                ['aaa', 'bbb', 'ccc xxx'],
                ['111', '222 yyy', '333'],
                ['222 zzz', '777', '888'],
                ['333 888', '444 000', '444']
            ],
            'firstLine': ['key1', 'key2', 'key3']
        });
    });
    it('process test', function() {
        const content = fs.readFileSync(path.join(__dirname, 'resources/process.txt'));
        const rv = parse2Object(content.toString(), {splitChars: ['\t']});
        expect(rv.records.length).to.gt(0);
    });
});



