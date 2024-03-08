require('axios');
//const { inputDirectory } = require('../../index.js')
const { getOne } = require('../../database_api/tenantService.js');
const { ingestData } = require('../../mysimbdp-daas.js');

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

    // inputDirectory.putFilesIntoInputDirectory(testData, '1');

    console.log('here1')
    await ingestData('1', testData);
    console.log('here2')

    // Wait for data to be ingested into MongoDB
    await new Promise(resolve => setTimeout(resolve, 20000));

    console.log('here3')
    testData.tenantId = '1'

    console.log('here4')
    // Stuck here in getOne after setting tenant Schema strict false
    const result = await getOne(testData);
    if (!result) {
        console.log('here5')
        throw new Error('Data not found in MongoDB');
    }
    console.log('here6')
    
    console.log('testData', testData);
    console.log('JSON.stringify(result)', JSON.stringify(result));

    console.log('here7')
    // Compare ingested data with test data
    if (!(deepEqual(JSON.parse(JSON.stringify(result)), testData))) {
        console.log('here8')
        throw new Error('Ingested data does not match test data');
    } else {
        console.log('test: tenant1_ingest_1_file.js PASSED');
    }

    console.log('here9')
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