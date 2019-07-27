import fs from 'fs';
import path from 'path';
const strip = require('strip-comments');

const fp = path.resolve(__dirname, '../dist/main.js');
let data: string = strip(fs.readFileSync(fp).toString());
data = data.replace(/\n\n/mg, '\n');
fs.writeFileSync(fp, data);
