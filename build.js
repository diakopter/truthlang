const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt");
const path = require("path");
const cpp = require("./cpp.js");

var wat_processed = "not_done";
var pp_error = "";

const pp = cpp.create( { 
    signal_char : '#',
    warn_func : null,
    error_func : null,
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
    },
    comment_stripper : null
 } );

const inputWat = "truth.wat";

while (wat_processed === "not_done") {
    await new Promise(done => setTimeout(done, 500));
}
if (wat_processed === "errored") {
    throw pp_error;
}

writeFileSync("main.wat", wat_processed); // cache output for debugging/fun
const wasmModule = wabt.parseWat(inputWat, wat_processed);

const { buffer } = wasmModule.toBinary({});

const outputWasm = "main.wasm";
writeFileSync(outputWasm, Buffer.from(buffer));

