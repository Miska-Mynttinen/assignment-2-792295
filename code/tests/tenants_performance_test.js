const fs = require('fs').promises;
const path = require('path');
const { inputDirectory } = require('../../index.js')
const { getTestSourceData } = require('../../assignment_1_code_used/dataService.js');

async function runPerformanceTest() {
    const testData = await getTestSourceData();
    const testDataLength = testData.length;
    await saveSourceDataSize(testData)
    const iterationTimes = [];
    
    // Prepare two sets of iterations
    const iterations = [
        { startPercentage: 0, endPercentage: 0.4, tenant: '1' },
        { startPercentage: 0.6, endPercentage: 1.0, tenant: '2' }
    ];

    // Execute iterations concurrently
    await Promise.all(iterations.map(async ({ startPercentage, endPercentage, tenant }) => {
        const startTime = Date.now();
        const startIndex = Math.floor(startPercentage * testDataLength);
        const endIndex = Math.floor(endPercentage * testDataLength);
        console.log('\nstartIndex', startIndex);
        console.log('\nendIndex', endIndex);
        for (let i = startIndex; i < endIndex; i++) {
            await inputDirectory.putFilesIntoInputDirectory(testData[i], tenant);
        }
        const endTime = Date.now();
        const iterationTime = endTime - startTime; // milliseconds
        iterationTimes.push(iterationTime);
    }));
    
    await saveIterationTimes(iterationTimes);
}

async function saveIterationTimes(iterationTimes) {
    const relativeFilePath = path.join(__dirname, 'tenants_performance_test.json');
    await fs.writeFile(relativeFilePath, JSON.stringify(iterationTimes));
}

async function saveSourceDataSize(sourceData) {
    const relativeFilePath = path.join(__dirname, 'tenants_performance_source_data_size.json');

    // Calculate the size of the array in bytes
    const sizeInBytes = Buffer.byteLength(JSON.stringify(sourceData));

    // Save the size to the file
    await fs.writeFile(relativeFilePath, JSON.stringify({ sizeInBytes }));
}

// Run the performance test
runPerformanceTest()
    .then(() => console.log('Performance test completed successfully'))
    .catch(error => console.error('Performance test failed:', error));