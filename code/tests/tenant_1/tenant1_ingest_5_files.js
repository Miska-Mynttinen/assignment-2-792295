require('axios');
const inputDirectory = require('../../index.js');
const produce = require('../../assignment_1_code_used/kafka_producer.js');
const consume = require('../../assignment_1_code_used/kafka_consumer.js');
const { readFilesInDirectory } = require('../../scripts/get_files_in_directory.js')

async function runTest() {
    const testData = readFilesInDirectory('./tenant_1_test_files');

        inputDirectory.putFilesIntoInputDirectory(testData, '1');

        const result = await getOne(testData.id);
        if (!result) {
            throw new Error('Data not found in MongoDB');
        }

        // Compare ingested data with test data
        if (!(deepEqual(JSON.parse(JSON.stringify(result)), testData))) {
            throw new Error('Ingested data does not match test data');
        } else {
            console.log('test: ingest_one_file.js PASSED');
        }  
};

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
  
    return true;
}
  
function isObject(object) {
    return object != null && typeof object === 'object';
}

runTest();