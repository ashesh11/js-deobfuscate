const fs = require('fs');
const sourceMap = require('source-map');

async function decodeSourceMap(inputFile) {
    try {
        // Read the source map file
        const rawSourceMap = fs.readFileSync(inputFile, 'utf8');
        const parsedSourceMap = JSON.parse(rawSourceMap);

        // Create a SourceMapConsumer instance
        const smc = await new sourceMap.SourceMapConsumer(parsedSourceMap);

        // Ensure the source map contains sources
        if (smc.sources && smc.sources.length > 0) {
            // Output file for combined references
            const outputFile = inputFile.replace('.js.map', '.deobfuscated.js');
            
            // Retrieve and write the content for all referenced sources
            let combinedContent = '';
            smc.sources.forEach((source) => {
                // Try to get content from the source map
                const content = smc.sourceContentFor(source);
                
                // If no content is found in the source map, you will need to manually load the source file
                if (content) {
                    combinedContent += content;
                } else {
                    console.warn(`No content found for source: ${source}. Please ensure source files are available.`);
                }
            });

            // Write combined content to the output file
            fs.writeFileSync(outputFile, combinedContent);
            console.log(`Deobfuscated code written to ${outputFile}`);
        } else {
            console.error('No sources found in the source map.');
        }

        smc.destroy(); // Clean up the SourceMapConsumer
    } catch (error) {
        console.error('Error reading or parsing source map:', error);
    }
}

decodeSourceMap('script.js.map');
