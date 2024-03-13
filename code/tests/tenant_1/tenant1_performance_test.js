const fs = require('fs').promises;
const path = require('path');
const { inputDirectory } = require('../../index.js')
const { getTestSourceData } = require('../../assignment_1_code_used/dataService.js');

async function runPerformanceTest() {
    const testData = await getTestSourceData();
    const testDataLength = testData.length;
    await saveSourceDataSize(testData.slice(0, (0.4 * testDataLength)))
    const iterationTimes = [];
    
    /* Items at the start of the source data */
    for (let i = 0; i < 4; i++) {
        const startTime = Date.now();
        const startIndex = Math.floor((i * 0.1) * testDataLength);
        const endIndex = Math.floor(((i + 1) * 0.1) * testDataLength);

        console.log('\nstartIndex', startIndex);
        console.log('\nendIndex', endIndex);
        for (let j = startIndex; j < endIndex; j++) {
            await inputDirectory.putFilesIntoInputDirectory(testData[j], '1');
        }

        const endTime = Date.now();
        const iterationTime = endTime - startTime; // milliseconds
        iterationTimes.push(iterationTime);
    }
    
    await saveIterationTimes(iterationTimes);
}

async function saveIterationTimes(iterationTimes) {
    const relativeFilePath = path.join(__dirname, 'tenant_1_performance_test.json');
    await fs.writeFile(relativeFilePath, JSON.stringify(iterationTimes));
}

async function saveSourceDataSize(sourceData) {
    const relativeFilePath = path.join(__dirname, 'tenant_1_performance_source_data_size.json');

    // Calculate the size of the array in bytes
    const sizeInBytes = Buffer.byteLength(JSON.stringify(sourceData));

    // Save the size to the file
    await fs.writeFile(relativeFilePath, JSON.stringify({ sizeInBytes }));
}

// Run the performance test
runPerformanceTest()
    .then(() => console.log('Performance test completed successfully'))
    .catch(error => console.error('Performance test failed:', error));