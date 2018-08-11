const pretty = require('pretty-time');

import {entryPoint} from "./main.wasm";

const timeit = (func) => {
    const start = process.hrtime();
    const result = func();
    console.log("Elapsed: " + pretty(process.hrtime(start)));
    return result;
};

console.log("Result: " + timeit(() => {return entryPoint(4, 4)}));

