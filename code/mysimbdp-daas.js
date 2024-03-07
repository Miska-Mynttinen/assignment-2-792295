require('axios');
const { getAll, getOne } = require('../dataService.js');
const produce = require('../kafka_producer.js');
const consume = require('../kafka_consumer.js');

const ingestData = async (tenantId, data) => {
    // Produce data to Kafka topic
    await produce(`${tenantId}-topic`, [{ value: JSON.stringify(data) }]);

    // Consume data from Kafka topic
    const consumer = await consume(`${tenantId}-topic`, `${tenantId}-group`);

    // Wait for data to be ingested into MongoDB
    await new Promise(resolve => setTimeout(resolve, 1000));

    await consumer.disconnect();
}

const getAllData = async () => {
    const result = await getAll();
    if (!result) {
        throw new Error('Data not found in MongoDB');
    }
    return result
}

const getOneData = async fileData => {
    const result = await getOne(fileData);
    if (!result) {
        throw new Error('Data not found in MongoDB');
    }
    return result
}

module.exports = { ingestData, getAllData, getOneData }