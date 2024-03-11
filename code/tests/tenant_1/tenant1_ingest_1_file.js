const { inputDirectory } = require('../../index.js')
const { getOne } = require('../../database_api/tenantService.js');

async function runTest() {
    const testData = {
        id: '19195987458',
        sampling_rate: null,
        timestamp: '2024-02-12 18:04:02',
        location: {
            id: '72428',
            latitude: '41.978',
            longitude: '21.464',
            altitude: '241.2',
            country: 'MK',
            exact_location: '0',
            indoor: '0'
        },
        sensor: {
            id: '82705',
            pin: '1',
            sensor_type: {
                id: '14',
                name: 'SDS011',
                manufacturer: 'Nova Fitness'
            }
        },
        sensordatavalues: [
            { id: '43583940173', value: '148.60', value_type: 'P1' },
            { id: '43583940174', value: '68.40', value_type: 'P2' }
        ]
    };

    inputDirectory.putFilesIntoInputDirectory(testData, '1');

    const modifiedTestData = { ...testData, tenantId: '1' };

    // Whole notifying and ingestion takes a lot of time for data to be accessible (1 minute).
    await new Promise(resolve => setTimeout(resolve, 60000));

    const result = await getOne(modifiedTestData);
    if (!result) {
        throw new Error('Data not found in MongoDB');
    }
    
    // Compare ingested data with test data
    if (!(deepEqual(JSON.parse(JSON.stringify(result)), modifiedTestData))) {
        throw new Error('Ingested data does not match test data');
    } else {
        console.log('test: tenant1_ingest_1_file.js PASSED');
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