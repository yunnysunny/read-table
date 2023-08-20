const SPACE_CHARS = [
    ' ',
    '\t',
];
const QUOTATION_CHAR = '"';
function isSpace(char) {
    return SPACE_CHARS.indexOf(char) !== -1 ? char : null;
}
/**
 * Parsing table like output to object array
 * @param {string} output 
 */
exports.parse = function(output) {
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
        case isSpace(char): // get a space
            if ((quotationStart && !quotationEnd)) {
                currentField += char;
            }
            lastChar = char;
            break;
        case QUOTATION_CHAR:
            if (!quotationStart) {
                quotationStart = true;
                quotationEnd = false;
                // ignore first quotation char
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
            if (isSpace(lastChar)) {
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