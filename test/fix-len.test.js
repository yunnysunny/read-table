const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { parseFixed } = require('..');
const { parseFixedHead } = require('..');

describe('fix len test', function() {
    function formatNColsTable(fields) {
        let row = '';
        for (let i = 0, len = fields.length; i < len; i++) {
            const field = fields[i];
            row += `${field.name}${' '.repeat(field.length - field.name.length)}`;
        }
        row += '\n';
        return row;
    }
    function formatFixedColsTable(fieldNames, colLens) {
        const fields = fieldNames.map((name, index) => {
            return {
                name,
                length: colLens[index]
            };
        });
        return formatNColsTable(fields);
    }
    it('process test', function() {
        const content = fs.readFileSync(path.join(__dirname, 'resources/fixed_len.txt'));
        const rv = parseFixed(content.toString());
        expect(rv.fieldNames.length).to.eq(3);
    });
    it('parse head with fixed length columns', function() {
        const fields = [
            {name: 'head1', length: 10},
            {name: 'head2', length: 9},
            {name: 'head3', length: 7},
        ];


        const head = formatNColsTable(fields);
        const {fieldNames, firstLenEnd} = parseFixedHead(head);

        expect(firstLenEnd).to.eq(head.length - 1);
        expect(fieldNames.length).to.eq(3);
        const expectedFields = [
            {
                begin: 0,
                end: fields[0].length  -1,
                name: fields[0].name,
                len: fields[0].length
            }
        ];
        expectedFields[1] = {
            begin: expectedFields[0].end + 1,
            end: fields[1].length + fields[0].length - 1,
            len: fields[1].length,
            name: fields[1].name
        };
        expectedFields[2] = {
            begin: expectedFields[1].end + 1,
            end: fields[2].length + fields[1].length + fields[0].length - 1,
            len: fields[2].length,
            name: fields[2].name
        };
        expect(fieldNames).to.eql(expectedFields);
    });

    it('parse table with fixed length columns', function() {
        const fixedLength = [13, 10, 11];
        const head = [
            'head1',
            'head2',
            'head3',
        ];
        const headRow = formatFixedColsTable(head, fixedLength);
        const row1 = [
            'value10',
            'value11',
            'value12',
        ];
        const row1Str = formatFixedColsTable(row1, fixedLength);
        const row2 = [
            'value20',
            'value21',
            'value22',
        ];
        const row2Str = formatFixedColsTable(row2, fixedLength);
        const table = headRow + row1Str + row2Str;
        console.log(table);
        const {lines} = parseFixed(table);
        expect(lines).to.eql([
            {
                [head[0]]: row1[0],
                [head[1]]: row1[1],
                [head[2]]: row1[2]
            },
            {
                [head[0]]: row2[0],
                [head[1]]: row2[1],
                [head[2]]: row2[2]
            }
        ]);
        console.log(JSON.stringify(lines));
    });
});