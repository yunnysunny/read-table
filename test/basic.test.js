const { parse } = require('..');
const { expect } = require('chai');
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
});



