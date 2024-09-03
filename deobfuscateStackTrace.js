const fs = require('fs');
const sourceMap = require('source-map');

async function deobfuscateStackTrace(obfuscatedStackTraceFile, sourceMapFile) {
    try {
        // Read and parse the source map data
        const sourceMapData = fs.readFileSync(sourceMapFile, 'utf8');
        const obfuscatedStackTrace = fs.readFileSync(obfuscatedStackTraceFile, 'utf8');
        const parsedSourceMap = JSON.parse(sourceMapData);
        console.log(parsedSourceMap);
        const smc = await new sourceMap.SourceMapConsumer(parsedSourceMap);

        // Split the stack trace into lines
        const stackLines = obfuscatedStackTrace.split('\n');

        // Array to hold the deobfuscated stack trace
        const deobfuscatedStackLines = stackLines.map(line => {
            // Regex to capture the stack trace format
            const match = line.match(/at (.*) \((.*):(\d+):(\d+)\)/);
            if (match) {
                const [ , functionName, fileName, lineNumber, columnNumber ] = match;

                // Map the obfuscated line/column to original source positions
                const originalPosition = smc.originalPositionFor({
                    line: parseInt(lineNumber, 10),
                    column: parseInt(columnNumber, 10)
                });

                console.log('Original Position:', originalPosition);

                if (originalPosition.source) {
                    return `\tat ${originalPosition.name || functionName} (${originalPosition.source}:${originalPosition.line}:${originalPosition.column})`;
                } else {
                    return line; // Return the original line if no mapping is found
                }
            } else {
                return line; // Return the original line if no match is found
            }
        });

        // Output the deobfuscated stack trace
        const outputFile = 'deobfuscated.stacktrace';
        fs.writeFileSync(outputFile, deobfuscatedStackLines.join('\n'));
        console.log(`Deobfuscated stack trace written to ${outputFile}`);

        smc.destroy(); // Clean up the SourceMapConsumer
    } catch (error) {
        console.error('Error reading or parsing files:', error);
    }
}

// Example usage
deobfuscateStackTrace('stack-trace.txt', 'script.js.map');
