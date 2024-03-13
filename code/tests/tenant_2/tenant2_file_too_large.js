const fs = require('fs');
const { inputDirectory } = require('../../index.js')
const { getTestSourceData } = require('../../assignment_1_code_used/dataService.js');

async function runTest() {
    const sourceData = await getTestSourceData();

    /* Create a file that is over 5MB and try to ingest it */
    combineJSONFiles(sourceData, (err, combinedData) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Combined JSON data:', combinedData);
            try {
                inputDirectory.putFilesIntoInputDirectory(combinedData, '2');
            } catch (error) {
                // Check if the error matches
                console.log(error.message);
                if (error.message === `A given file is too large. Allowed maximum size in MB is 5`) {
                    // Handle the specific error
                    console.log('test: tenant2_file_too_large.js PASSED');
                } else {
                    console.log('test: tenant2_file_too_large.js FAILED');
                }
            }
        }
    });
};

function combineJSONFiles(files, callback) {
    let combinedArray = [];

    // Helper function to read a single file
    function readFile(file, index) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                callback(err);
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                combinedArray = combinedArray.concat(jsonData);
                if (index === files.length - 1) {
                    callback(null, combinedArray);
                }
            } catch (parseError) {
                callback(parseError);
            }
        });
    }

    // Read each file and merge its contents
    files.forEach((file, index) => {
        readFile(file, index);
    });
}

runTest();