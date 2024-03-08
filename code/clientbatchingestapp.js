const fs = require('fs');
const path = require('path');
const { ingestData } = require('./mysimbdp-daas.js')

const readFiles = (tenantId, dataId, inputDirectory) => {
    // Read data from JSON file as an example
    const data = inputDirectory.giveDataToTenant(tenantId, dataId);
    // this.data = JSON.parse(fileContent);
    return data
}

const wrangleData = (tenantId, data) => {
    // Add tenant id to all files in data
    data.forEach(file => {
        file.tenantId = tenantId;
    });

    return data;
}

const ingestTenantData = (tenantId, data) => {
    // Ingest data into mysimbdp-coredms through mysimbdp-daas API
    ingestData(tenantId, data);
}

const testIngestionPerformance = (tenantId, data, constraints) => {
    const startTime = Date.now() * 1000; // in seconds
    
    // Ingest the data
    ingestTenantData(tenantId, data, constraints)
        .then(() => {
        const endTime = Date.now() * 1000;
        const duration = endTime - startTime; // in seconds
        const dataSize = data.length; // in bytes
        const speed = dataSize / duration; // in bytes per second
    
        console.log(`Ingestion speed for tenant ${tenantId}: ${speed} bytes/s`);
        })
        .catch(error => {
        console.error(`Ingestion failed for tenant ${tenantId}: ${error.message}`);
        });
}


const clientbatchingest = (tenantId, dataId, inputDirectory) => {
    const data = readFiles(tenantId, dataId, inputDirectory);
    const wrangledData = wrangleData(tenantId, data);
    ingestData(tenantId, wrangledData);
}

module.exports = { clientbatchingest };

// Usage
/*const app = new ClientBatchIngestApp('/path/to/client-staging-input-directory');
app.run();

const tenant1Data = /* ...
const tenant1Constraints = /* ...
*/