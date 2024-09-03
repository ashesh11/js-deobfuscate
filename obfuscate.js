const path = require('path'); // Add this line to import the 'path' module
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const esprima = require('esprima');

function obfuscateJS(inputFile) {
    // Read the input file
    const code = fs.readFileSync(inputFile, 'utf8');
    const outputFile = inputFile.replace('.original.js', '.js');
    const sourceMapFile = inputFile.replace('.original.js', '.js.map');

    // Simplified configuration for obfuscation
    const obfuscationOptions = {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal', // Can be 'hexadecimal', 'mangled', 'mangled-shuffled'
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: false,
        stringArrayEncoding: [], // Corrected to be an array with valid values
        stringArrayThreshold: 0.75,
        target: 'node', // Or 'browser' depending on your environment
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        sourceMap: true, // Enable source map generation
        sourceMapMode: 'separate',
        sourceMapFileName: path.basename(sourceMapFile),
        inputFileName: 'script.original.js',
    };

    // Obfuscate the code
    const result = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    const obfuscatedCode = result.getObfuscatedCode();

    // Validate the obfuscated code
    try {
        esprima.parseScript(obfuscatedCode);
        console.log('Obfuscated code is valid JavaScript');
    } catch (e) {
        console.error('Obfuscated code has syntax errors:', e.message);
        return;
    }

    // Write the obfuscated code to the output file
    fs.writeFileSync(outputFile, obfuscatedCode);
    console.log(`Obfuscated code written to ${outputFile}`);

    // Write the source map to a file
    fs.writeFileSync(sourceMapFile, result.getSourceMap());
    console.log(`Source map written to ${sourceMapFile}`);
}

obfuscateJS('script.original.js');
