const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt");
const path = require("path");
const cpp = require("./cpp.js");
const sleep = require('system-sleep');

var wat_processed = "not_done";
var pp_error = "";

const pp = cpp.create( { 
    signal_char : '#',
    include_func : function(file, is_global, resumer, error) {
        // `is_global` is `true` if the file name was enclosed
        // in < .. > rather than " .. ".
        const contents = readFileSync(file, "utf8");
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
    }
 } );

const startWat = "truth.wat";

const inputSrc = readFileSync(startWat, "utf8");
var source = pp.run(inputSrc);
while (wat_processed === "not_done") {
    sleep(100);
}
if (wat_processed === "errored") {
    throw "errored: " + pp_error;
}

const mainWat = "main.wat";
writeFileSync(mainWat, wat_processed); // cache output for debugging/fun
const wasmModule = wabt.parseWat(mainWat, wat_processed);

const { buffer } = wasmModule.toBinary({});

const outputWasm = "main.wasm";
writeFileSync(outputWasm, Buffer.from(buffer));

