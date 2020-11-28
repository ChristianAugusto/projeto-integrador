import fs from 'fs';



export default class {
    /**
        * @param {String} filename
        * @param {String} delimiter
    */
    constructor(filename, delimiter) {
        this.filename = filename;
        this.delimiter = delimiter;

        fs.writeFileSync(`${filename}.csv`, '');
    }

    /**
        * @param {String} header
    */
    writeHeader(values) {
        fs.appendFileSync(`${this.filename}.csv`, `${values.join(this.delimiter)}\n`);
    }

    /**
        * @param {String} lines
    */
    writeLine(values) {
        fs.appendFileSync(`${this.filename}.csv`, `${values.join(this.delimiter)}\n`);
    }

    /**
        * @param {Array} lines
    */
    writeLines(lines) {
        for (let i = 0; i < lines.length; i++) {
            this.writeLine(lines[i]);
        }
    }
}
