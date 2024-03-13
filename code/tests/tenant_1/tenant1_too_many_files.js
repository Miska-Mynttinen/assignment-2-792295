const { inputDirectory } = require('../../index.js')
const { getTestSourceData } = require('../../assignment_1_code_used/dataService.js');

async function runTest() {
    const sourceData = await getTestSourceData();

    // Limit is 10 files a a time so 11 should cause an error
    const tooManyFiles = sourceData.slice(10);

    try {
        inputDirectory.putFilesIntoInputDirectory(tooManyFiles, '1');
    } catch (error) {
        // Check if the error matches
        console.log(error.message);
        if (error.message === `Too many files inserted at once. Allowed maximum: 10`) {
            // Handle the specific error
            console.log('test: tenant1_too_many_files.js PASSED');
        } else {
            console.log('test: tenant1_too_many_files.js FAILED');
        }
    }
};

runTest();