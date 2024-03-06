const fs = require('fs');
const path = require('path');

class ClientBatchIngestApp {
    constructor(inputDirectory) {
        this.inputDirectory = inputDirectory;
    }

    readFiles() {
        // Read data from JSON file as an example
        const filePath = path.join(this.inputDirectory, 'data.json');
        const fileContent = fs.readFileSync(filePath);
        this.data = JSON.parse(fileContent);
    }

    wrangleData() {
        // Perform data wrangling operations
        // For example, let's normalize a column "value" to range 0-1
        const values = this.data.map(item => item.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        this.data = this.data.map(item => ({
            ...item,
            value: (item.value - min) / (max - min),
        }));
    }

    ingestData() {
        // Ingest data into mysimbdp-coredms
        mysimbdpCoredms.ingest(this.data); // placeholder
    }

    testIngestionPerformance(tenantId, data, constraints) {
        const startTime = Date.now();
      
        // Ingest the data
        ingestData(tenantId, data, constraints)
          .then(() => {
            const endTime = Date.now();
            const duration = endTime - startTime; // in milliseconds
            const dataSize = data.length; // in bytes
            const speed = dataSize / duration; // in bytes per millisecond
      
            console.log(`Ingestion speed for tenant ${tenantId}: ${speed} bytes/ms`);
          })
          .catch(error => {
            console.error(`Ingestion failed for tenant ${tenantId}: ${error.message}`);
          });
      }
      

    run() {
        this.readFiles();
        this.wrangleData();
        this.ingestData();
    }
}

// Usage
/*const app = new ClientBatchIngestApp('/path/to/client-staging-input-directory');
app.run();

const tenant1Data = /* ...
const tenant1Constraints = /* ...
testIngestionPerformance('tenant1', tenant1Data, tenant1Constraints);
*/