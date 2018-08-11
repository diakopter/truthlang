var pretty = require('pretty-time');

import {entryPoint} from "./main.wasm";

var timeit = (func) => {
    var start = process.hrtime();
    var result = func();
    console.log("Elapsed: " + pretty(process.hrtime(start)));
    return result;
};

console.log("Result: " + timeit(() => {return entryPoint(4, 4)}));

