const winston = require('winston');
const fs = require('fs');

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'mysimbdp' },
  transports: [
    new winston.transports.File({ filename: 'logs/ingestion.log' }),
  ],
});

// Function to log successful ingestion
function logSuccess(tenantId, fileName, fileSize, ingestionTime) {
  logger.info({
    tenantId,
    fileName,
    status: 'success',
    fileSize,
    ingestionTime,
    timestamp: new Date().toISOString(),
  });
}

// Function to log failed ingestion
function logFailure(tenantId, fileName, errorMessage) {
  logger.error({
    tenantId,
    fileName,
    status: 'failure',
    errorMessage,
    timestamp: new Date().toISOString(),
  });
}

// Example usage of logging functions
const tenantId = 'tenant1';
const fileName = 'data.csv';
const fileSize = 1024; // in bytes
const ingestionTime = 5000; // in milliseconds
const errorMessage = 'File format not supported';

logSuccess(tenantId, fileName, fileSize, ingestionTime);
// Output in logs/ingestion.log: {"tenantId":"tenant1","fileName":"data.csv","status":"success","fileSize":1024,"ingestionTime":5000,"timestamp":"2024-03-06T12:00:00.000Z"}

logFailure(tenantId, fileName, errorMessage);
// Output in logs/ingestion.log: {"tenantId":"tenant1","fileName":"data.csv","status":"failure","errorMessage":"File format not supported","timestamp":"2024-03-06T12:00:00.000Z"}