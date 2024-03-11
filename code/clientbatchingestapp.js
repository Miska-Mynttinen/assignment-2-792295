const { ingestData } = require('./mysimbdp-daas.js')

const readFiles = (tenantId, dataId, inputDirectory) => {
    // Read data from JSON file as an example
    const data = inputDirectory.giveDataToTenant(tenantId, dataId);
    // this.data = JSON.parse(fileContent);
    return data
}

const wrangleData = (tenantId, data) => {
    // Add tenant id to all files in data
    const wrangledData = (data[0] ?? data).map(file => {
        // Create a new object with tenantId added
        return { ...file, tenantId: tenantId };
    });

    return wrangledData;
}

/*const testIngestionPerformance = (tenantId, data, constraints) => {
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
}*/


const clientbatchingest = (tenantId, dataId, inputDirectory) => {
    const data = readFiles(tenantId, dataId, inputDirectory);
    const wrangledData = wrangleData(tenantId, data);
    // Ingest data into mysimbdp-coredms through mysimbdp-daas API
    ingestData(tenantId, wrangledData);
}

module.exports = { clientbatchingest };