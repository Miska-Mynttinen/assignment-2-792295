require('axios');
const { getAll, getOne } = require('./assignment_1_code_used/dataService.js');
// const { getAll, getOne } = require('./database_api/tenantService.js');
const produce = require('./assignment_1_code_used/kafka_producer.js');
const consume = require('./assignment_1_code_used/kafka_consumer.js');

const ingestData = async (tenantId, data) => {
    let consumer;
    let createResults;
    try {
        // Produce data to Kafka topic
        await produce(`${tenantId}-topic`, [{ value: JSON.stringify(data) }]);

        // Consume data from Kafka topic
        const consumerObj = await consume(`${tenantId}-topic`, `${tenantId}-group`);
        // Consumer
        consumer = consumerObj[0];
        // POST request return results
        createResults = consumerObj[1];
    } catch (error) {
        console.error(error);
        await consumer.disconnect();
    } finally {
        if (consumer) {
            // Disconnect consumer When POST promises have resolved
            // Wait for 100ms before checking again
            while (createResults && createResults.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            await consumer.disconnect();
            return createResults;
        }
    }
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