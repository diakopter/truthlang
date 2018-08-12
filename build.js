const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt");
const path = require("path");
const cpp = require("./cpp.js");
const sleep = require('system-sleep');

var wat_processed = "not_done";
var pp_error = "";

const pp = cpp.create( { 
    signal_char : '#',
//    warn_func : null,
    error_func : function(error) {
        throw "got pp error: " + error;
    },
    include_func : function(file, is_global, resumer, error) {
        // `is_global` is `true` if the file name was enclosed
        // in < .. > rather than " .. ".
        const contents = readFileSync(file, "utf8");
        console.log("got contents: " + contents);
        if (contents === null) {
            pp_error = "could not access " + file + ":\n" + error;
            wat_processed = "errored";
            resumer(null);
        }
        else {
            resumer(contents);
        }
    },
    completion_func : function(processed) {
        wat_processed = processed;
    },
    comment_stripper : null
 } );

const startWat = "truth.wat";

console.log("got 1");
const inputSrc = readFileSync(startWat, "utf8");
console.log("got startsrc " + inputSrc);
var source = pp.run(inputSrc);
console.log('got source' + source);
while (wat_processed === "not_done") {
    
}
if (wat_processed === "errored") {
    throw "errored: " + pp_error;
}

writeFileSync("main.wat", wat_processed); // cache output for debugging/fun
const wasmModule = wabt.parseWat(inputWat, wat_processed);

const { buffer } = wasmModule.toBinary({});

const outputWasm = "main.wasm";
writeFileSync(outputWasm, Buffer.from(buffer));

