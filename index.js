const SPACE_CHARS = [
    ' ',
    '\t',
];
const SPACE = ' ';
const QUOTATION_CHAR = '"';
function isSpace(char, splitChars) {
    return splitChars.indexOf(char) !== -1 ? char : null;
}
/**
 * Parsing table like output to object array
 * @param {string} output 
 * @param {import('.').ParseOptions} options
 * @returns {import('.').RawLines}
 */
exports.parseRaw = function(output, options) {
    options = {
        splitChars: SPACE_CHARS,
        ...(options || {})
    };
    const len = output.length;
    let firstLine = [];
    let currentLine = [];
    const lines = [];
    let currentField = '';
    let firstLineEnd = false;
    let lastChar = '';
    let quotationStart = false;
    let quotationEnd = false;

    function addField(forceFinish) {
        if (!forceFinish && currentLine.length === firstLine.length - 1) {
            // all the left chars are part of the last field 
            return;
        }
        currentLine.push(currentField);
        currentField = '';
    }
    function addLine() {
        if (currentLine.length === 0) {
            //skip empty line
            return;
        }

        lines.push(currentLine);
        currentLine = [];
    }

    for(let i=0;i<len;i++) {
        const char = output[i];
        switch (char) {
        case '\n':
            addField(true);
            lastChar = char;
            //newline
            if (firstLineEnd) {
                //add new line
                addLine();
            } else {
                //get fist line
                if ((currentLine.length === 0)
                    || (currentLine.length === 1 && currentLine[0] === '')
                ) {
                    //skip empty line 
                    currentLine = [];
                    break;
                }
                firstLineEnd = true;
                firstLine = currentLine.splice(0);
            }
            break;
        case isSpace(char, options.splitChars): // get a space
            if ((quotationStart && !quotationEnd)) {
                currentField += char;
            }
            lastChar = char;
            break;
        case QUOTATION_CHAR:
            if (!quotationStart) {
                quotationStart = true;
                quotationEnd = false;
                // check if currentField has value to ignore first quotation char
                if (currentField) {
                    addField();
                }
            } else {
                quotationStart = false;
                quotationEnd = true;
                addField();
            }
            lastChar = char;
            break;
        default:
            if (isSpace(lastChar, options.splitChars)) {
                if ((quotationStart)) {
                    // skip
                } else if (quotationEnd) {
                    //reset quotation status
                    quotationEnd = false;
                    //skip
                } else {
                    //new field
                    addField();
                }
            }
            currentField += char;

            lastChar = char;
            break;
        }
    }
    return {
        lines,
        firstLine
    };
};
/**
 * 
 * @param {string} output 
 * @returns {import('.').Head}
 */
exports.parseFixedHead = function(output) {
    const len = output.length;
    let firstLenEnd = 0;
    let fieldName = '';
    const fieldNames = [];
    let beginIndex = -1;
    let lastChar = '';
    // const fieldCount = 0;
    let count = 0;
    function addField(i) {
        if (fieldName) {
            if (count === 0) {
                fieldNames[0].name = fieldName;
                fieldNames[0].end = i - 1;
                fieldNames[0].len = i - beginIndex;
            } else {
                const lastFiled = fieldNames[count-1];

                fieldNames[count] = {
                    name: fieldName,
                    begin: lastFiled.end + 1,
                    end: i - 1,
                    len: i - 1 - lastFiled.end,
                };
            }
            count++;
            fieldName = '';
        }
    }
    firstLen: for (let i=0; i < len; i++) {
        const char = output[i];
        switch (char) {
        case'\r':
            lastChar = char;
            break;
        case '\n':
            if (fieldNames.length > 0) {
                firstLenEnd = i;
                addField(i);
                break firstLen;
            }
            lastChar = char;
            break;
        case SPACE:
            lastChar = SPACE;
            break;
        default:
            if (beginIndex === -1) {
                beginIndex = i;
                if (!fieldNames[0]) {
                    fieldNames[0] = {begin: i, end: i, name: '', len: 0};
                }
            }
            if (lastChar === SPACE) {//to create field
                addField(i);
            }
            fieldName += char;
            lastChar = char;
            break;
        }
    }
    return { fieldNames, firstLenEnd };
};
/**
 * Parse table with fixed table cells.
 * @param {string} output 
 * @returns {import('.').FixedLines}
 */
exports.parseFixed = function(output) {
    const { fieldNames, firstLenEnd } = exports.parseFixedHead(output);
    const len = output.length;
    let pos = firstLenEnd + 1;

    const fieldCount = fieldNames.length;
    let fieldStep = 0;
    let line = {};
    const lines = [];
    while(pos < len) {
        const field = fieldNames[fieldStep];
        let fullFieldValue = '';
        if (fieldStep === 0) {//newline begin
            if (output[pos] === '\n' || output[pos] === '\r') {
                pos++;
                continue;// skip empty line
            }
        }
        if (fieldStep < fieldCount - 1) {
            fullFieldValue = output.substring(pos, pos + field.len);
            line[field.name] = fullFieldValue.trimEnd();
            pos += field.len;
            fieldStep++;
        } else {
            let char = output[pos];

            while(char !== '\n') {
                if (char !== '\r') {
                    fullFieldValue += char;
                }
                pos++;
                char = output[pos];
            }
            line[field.name] = fullFieldValue.trimEnd();
            fieldStep = 0;
            lines.push(line);
            line = {};
        }
    }
    return { lines, fieldNames };
    
};
/**
 * Parsing table like output to object array
 * @param {string} output 
 * @returns {import('.').ObjectLines}
 */
exports.parseRaw2Object = function(output, options) {
    const parsed = exports.parseRaw(output, options);
    const { firstLine, lines } = parsed;
    const keyLen = firstLine.length;
    if (lines.length === 0) {
        return { firstLine, records: [] };
    }
    const records = lines.map(function doLoop(line) {
        const record = new Map();
        for (let i = 0; i < keyLen; i++) {
            const key = firstLine[i];
            record.set(key, line[i]);
        }
        return record;
    });
    return { firstLine, records };
};